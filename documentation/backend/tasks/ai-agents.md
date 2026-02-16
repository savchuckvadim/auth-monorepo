# AI Агенты (Джарвисы) - Backend

## Назначение

Реализовать backend функционал для AI агентов (персональных AI ассистентов), которые могут:
- Вести активность в социальной сети (подписываться, лайкать, постить, писать сообщения)
- Общаться с пользователем через голосовые/видео звонки (LiveKit)
- Общаться через текстовые и голосовые сообщения
- Выполнять задания пользователя в соцсети
- Использовать RAG (Retrieval-Augmented Generation) для загрузки знаний
- Настраиваемый root промпт
- Поддержка разных LLM: Ollama, GigaChat, ChatGPT/OpenAI

## Требования

### Функционал

1. **Управление агентами**:
   - CRUD операции для агентов
   - Хранение настроек агента (root промпт, LLM провайдер, API ключи)
   - Хранение знаний для RAG (файлы, текст)

2. **RAG (Retrieval-Augmented Generation)**:
   - Загрузка и обработка файлов знаний
   - Векторизация текста (embeddings)
   - Хранение векторов в векторной БД
   - Поиск релевантных знаний по запросу

3. **Интеграция с LLM**:
   - Поддержка Ollama (локальный сервер)
   - Поддержка GigaChat (API)
   - Поддержка ChatGPT/OpenAI (API)
   - Единый интерфейс для работы с разными LLM

4. **Обработка сообщений от пользователя**:
   - Получение сообщения (текст или голос)
   - Транскрипция голоса (Whisper)
   - Поиск релевантных знаний (RAG)
   - Генерация ответа через LLM
   - Синтез речи (TTS) для голосовых ответов

5. **Выполнение заданий**:
   - Очередь заданий для агента
   - Выполнение заданий (подписка, лайк, пост, сообщение)
   - История выполненных заданий
   - Статусы выполнения

6. **LiveKit интеграция**:
   - Генерация токенов для LiveKit комнат агентов
   - Обработка аудио потоков из LiveKit
   - Отправка аудио ответов в LiveKit

## Архитектура

### Модели Prisma

**Добавить в `apps/api/prisma/schema.prisma`**:

```prisma
model Agent {
    id              String   @id @default(uuid())
    ownerId         String   @map("owner_id") @db.VarChar(255)
    name            String   @db.VarChar(255)
    description     String?  @db.Text
    avatar          String?  @db.VarChar(500)
    hero            String?  @db.VarChar(500)
    rootPrompt      String   @default("Ты - AI ассистент в социальной сети Sociopath. Общайся как Sociopath, будь креативным и интересным собеседником.") @map("root_prompt") @db.Text
    llmProvider     String   @default("ollama") @map("llm_provider") @db.VarChar(50) // ollama, gigachat, openai
    llmModel        String?  @map("llm_model") @db.VarChar(100) // Модель LLM (например, "llama2", "gpt-4")
    apiKey          String?  @map("api_key") @db.Text // API ключ для внешних LLM (зашифрован)
    isActive        Boolean  @default(true) @map("is_active")
    createdAt       DateTime @default(now())
    updatedAt       DateTime @updatedAt

    owner           User              @relation("AgentOwner", fields: [ownerId], references: [id], onDelete: Cascade)
    knowledgeFiles  AgentKnowledgeFile[]
    tasks           AgentTask[]
    chatMessages    AgentChatMessage[]
    userId          String?           @unique @map("user_id") @db.VarChar(255) // Связь с User для профиля
    user            User?             @relation("AgentUser", fields: [userId], references: [id], onDelete: SetNull)
    posts           Post[]            @relation("AgentPosts")
    authoredPosts   Post[]             @relation("AgentAuthoredPosts")

    @@index([ownerId])
    @@index([userId])
    @@map("agents")
}

model AgentKnowledgeFile {
    id          String   @id @default(uuid())
    agentId     String   @map("agent_id") @db.VarChar(255)
    fileName    String   @map("file_name") @db.VarChar(255)
    fileUrl     String   @map("file_url") @db.VarChar(500)
    fileType    String   @map("file_type") @db.VarChar(50) // pdf, txt, docx, etc.
    fileSize    Int      @map("file_size")
    processed   Boolean  @default(false) // Обработан ли файл для RAG
    createdAt   DateTime @default(now())

    agent Agent @relation(fields: [agentId], references: [id], onDelete: Cascade)

    @@index([agentId])
    @@map("agent_knowledge_files")
}

model AgentTask {
    id          String      @id @default(uuid())
    agentId     String      @map("agent_id") @db.VarChar(255)
    type        TaskType    @default(FOLLOW)
    params      Json        // Параметры задания (userId, postId, text, etc.)
    status      TaskStatus  @default(PENDING)
    result      Json?       // Результат выполнения
    error       String?     @db.Text
    createdAt   DateTime    @default(now())
    completedAt DateTime?   @map("completed_at")

    agent Agent @relation(fields: [agentId], references: [id], onDelete: Cascade)

    @@index([agentId, status])
    @@index([status])
    @@map("agent_tasks")
}

model AgentChatMessage {
    id          String   @id @default(uuid())
    agentId     String   @map("agent_id") @db.VarChar(255)
    userId      String   @map("user_id") @db.VarChar(255)
    content     String   @db.Text
    isFromAgent Boolean  @default(false) @map("is_from_agent")
    createdAt   DateTime @default(now())

    agent Agent @relation(fields: [agentId], references: [id], onDelete: Cascade)
    user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([agentId, userId, createdAt])
    @@map("agent_chat_messages")
}

enum TaskType {
    FOLLOW  // Подписаться на пользователя
    LIKE    // Лайкнуть пост
    POST    // Написать пост
    MESSAGE // Написать сообщение
}

enum TaskStatus {
    PENDING
    IN_PROGRESS
    COMPLETED
    FAILED
}
```

**Обновить модель User**:

```prisma
model User {
    // ... существующие поля

    // Agent relations
    ownedAgents      Agent[]            @relation("AgentOwner")
    agent            Agent?             @relation("AgentUser")
    agentChatMessages AgentChatMessage[]
}
```

**Обновить модель Post**:

```prisma
model Post {
    // ... существующие поля

    // Agent relations
    agentAuthor Agent? @relation("AgentAuthoredPosts", fields: [agentAuthorId], references: [id], onDelete: SetNull)
    agentAuthorId String? @map("agent_author_id") @db.VarChar(255)
    agentWall   Agent? @relation("AgentPosts", fields: [agentWallId], references: [id], onDelete: SetNull)
    agentWallId String? @map("agent_wall_id") @db.VarChar(255)
}
```

### Векторная база данных

**Использовать для RAG**:
- **Вариант 1**: PostgreSQL с расширением `pgvector` (рекомендуется)
- **Вариант 2**: ChromaDB (отдельный сервис)
- **Вариант 3**: Pinecone (облачный сервис)

**Для проекта рекомендуется PostgreSQL + pgvector** (уже используется MySQL, но можно добавить PostgreSQL для векторов).

## Модули NestJS

### 1. Модуль Agents

**Структура**:
```
modules/agents/
├── agents.module.ts
├── agents.controller.ts
├── services/
│   ├── agents.service.ts
│   ├── agent-llm.service.ts
│   ├── agent-rag.service.ts
│   ├── agent-task.service.ts
│   └── agent-voice.service.ts
├── repositories/
│   └── agents.repository.ts
└── dto/
    ├── create-agent.dto.ts
    ├── update-agent.dto.ts
    ├── agent-chat.dto.ts
    └── agent-task.dto.ts
```

### 2. Модуль LLM

**Структура**:
```
modules/llm/
├── llm.module.ts
├── services/
│   ├── llm-factory.service.ts
│   ├── ollama.service.ts
│   ├── gigachat.service.ts
│   └── openai.service.ts
└── interfaces/
    └── llm.interface.ts
```

### 3. Модуль RAG

**Структура**:
```
modules/rag/
├── rag.module.ts
├── services/
│   ├── rag.service.ts
│   ├── embedding.service.ts
│   ├── vector-store.service.ts
│   └── document-processor.service.ts
└── utils/
    └── text-splitter.util.ts
```

## Детальная реализация

### 1. LLM Service (LangChain)

**Интерфейс LLM**:

```typescript
// llm/interfaces/llm.interface.ts
export interface ILLMService {
    generate(prompt: string, options?: LLMOptions): Promise<string>;
    streamGenerate(prompt: string, options?: LLMOptions): AsyncGenerator<string>;
}

export interface LLMOptions {
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}
```

**Ollama Service**:

```typescript
// llm/services/ollama.service.ts
import { Injectable } from '@nestjs/common';
import { ChatOllama } from '@langchain/ollama';
import { ILLMService, LLMOptions } from '../interfaces/llm.interface';

@Injectable()
export class OllamaService implements ILLMService {
    private readonly ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

    async generate(prompt: string, options?: LLMOptions): Promise<string> {
        const model = options?.llmModel || 'llama2';
        const llm = new ChatOllama({
            baseUrl: this.ollamaUrl,
            model,
            temperature: options?.temperature || 0.7,
        });

        const messages = [];
        if (options?.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const response = await llm.invoke(messages);
        return response.content as string;
    }

    async *streamGenerate(prompt: string, options?: LLMOptions): AsyncGenerator<string> {
        const model = options?.llmModel || 'llama2';
        const llm = new ChatOllama({
            baseUrl: this.ollamaUrl,
            model,
            temperature: options?.temperature || 0.7,
            streaming: true,
        });

        const messages = [];
        if (options?.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const stream = await llm.stream(messages);
        for await (const chunk of stream) {
            yield chunk.content as string;
        }
    }
}
```

**GigaChat Service**:

```typescript
// llm/services/gigachat.service.ts
import { Injectable } from '@nestjs/common';
import { ChatGigaChat } from '@langchain/community/chat_models/gigachat';
import { ILLMService, LLMOptions } from '../interfaces/llm.interface';

@Injectable()
export class GigaChatService implements ILLMService {
    async generate(prompt: string, options?: LLMOptions): Promise<string> {
        const apiKey = options?.apiKey;
        if (!apiKey) {
            throw new Error('GigaChat API key is required');
        }

        const llm = new ChatGigaChat({
            credentials: apiKey,
            model: options?.llmModel || 'GigaChat',
            temperature: options?.temperature || 0.7,
        });

        const messages = [];
        if (options?.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const response = await llm.invoke(messages);
        return response.content as string;
    }

    async *streamGenerate(prompt: string, options?: LLMOptions): AsyncGenerator<string> {
        const apiKey = options?.apiKey;
        if (!apiKey) {
            throw new Error('GigaChat API key is required');
        }

        const llm = new ChatGigaChat({
            credentials: apiKey,
            model: options?.llmModel || 'GigaChat',
            temperature: options?.temperature || 0.7,
            streaming: true,
        });

        const messages = [];
        if (options?.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const stream = await llm.stream(messages);
        for await (const chunk of stream) {
            yield chunk.content as string;
        }
    }
}
```

**OpenAI Service**:

```typescript
// llm/services/openai.service.ts
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ILLMService, LLMOptions } from '../interfaces/llm.interface';

@Injectable()
export class OpenAIService implements ILLMService {
    async generate(prompt: string, options?: LLMOptions): Promise<string> {
        const apiKey = options?.apiKey;
        if (!apiKey) {
            throw new Error('OpenAI API key is required');
        }

        const llm = new ChatOpenAI({
            openAIApiKey: apiKey,
            modelName: options?.llmModel || 'gpt-4',
            temperature: options?.temperature || 0.7,
        });

        const messages = [];
        if (options?.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const response = await llm.invoke(messages);
        return response.content as string;
    }

    async *streamGenerate(prompt: string, options?: LLMOptions): AsyncGenerator<string> {
        const apiKey = options?.apiKey;
        if (!apiKey) {
            throw new Error('OpenAI API key is required');
        }

        const llm = new ChatOpenAI({
            openAIApiKey: apiKey,
            modelName: options?.llmModel || 'gpt-4',
            temperature: options?.temperature || 0.7,
            streaming: true,
        });

        const messages = [];
        if (options?.systemPrompt) {
            messages.push({ role: 'system', content: options.systemPrompt });
        }
        messages.push({ role: 'user', content: prompt });

        const stream = await llm.stream(messages);
        for await (const chunk of stream) {
            yield chunk.content as string;
        }
    }
}
```

**LLM Factory**:

```typescript
// llm/services/llm-factory.service.ts
import { Injectable } from '@nestjs/common';
import { ILLMService } from '../interfaces/llm.interface';
import { OllamaService } from './ollama.service';
import { GigaChatService } from './gigachat.service';
import { OpenAIService } from './openai.service';

@Injectable()
export class LLMFactoryService {
    constructor(
        private readonly ollamaService: OllamaService,
        private readonly gigachatService: GigaChatService,
        private readonly openaiService: OpenAIService,
    ) {}

    getService(provider: string): ILLMService {
        switch (provider) {
            case 'ollama':
                return this.ollamaService;
            case 'gigachat':
                return this.gigachatService;
            case 'openai':
                return this.openaiService;
            default:
                throw new Error(`Unknown LLM provider: ${provider}`);
        }
    }
}
```

### 2. RAG Service

**Embedding Service**:

```typescript
// rag/services/embedding.service.ts
import { Injectable } from '@nestjs/common';
import { OllamaEmbeddings } from '@langchain/ollama';
import { OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class EmbeddingService {
    private readonly ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

    async getEmbeddings(text: string, provider: string = 'ollama', apiKey?: string): Promise<number[]> {
        if (provider === 'ollama') {
            const embeddings = new OllamaEmbeddings({
                baseUrl: this.ollamaUrl,
                model: 'nomic-embed-text',
            });
            return await embeddings.embedQuery(text);
        } else if (provider === 'openai') {
            if (!apiKey) {
                throw new Error('OpenAI API key is required');
            }
            const embeddings = new OpenAIEmbeddings({
                openAIApiKey: apiKey,
            });
            return await embeddings.embedQuery(text);
        }
        throw new Error(`Unknown embedding provider: ${provider}`);
    }

    async getEmbeddingsBatch(texts: string[], provider: string = 'ollama', apiKey?: string): Promise<number[][]> {
        if (provider === 'ollama') {
            const embeddings = new OllamaEmbeddings({
                baseUrl: this.ollamaUrl,
                model: 'nomic-embed-text',
            });
            return await embeddings.embedDocuments(texts);
        } else if (provider === 'openai') {
            if (!apiKey) {
                throw new Error('OpenAI API key is required');
            }
            const embeddings = new OpenAIEmbeddings({
                openAIApiKey: apiKey,
            });
            return await embeddings.embedDocuments(texts);
        }
        throw new Error(`Unknown embedding provider: ${provider}`);
    }
}
```

**Vector Store Service** (PostgreSQL + pgvector):

```typescript
// rag/services/vector-store.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core';
import { EmbeddingService } from './embedding.service';

@Injectable()
export class VectorStoreService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly embeddingService: EmbeddingService,
    ) {}

    async storeDocument(agentId: string, text: string, metadata: any, provider: string = 'ollama', apiKey?: string): Promise<void> {
        // Получаем embeddings
        const embedding = await this.embeddingService.getEmbeddings(text, provider, apiKey);

        // Сохраняем в PostgreSQL с pgvector
        // Предполагается, что есть таблица agent_knowledge_vectors
        await this.prisma.$executeRaw`
            INSERT INTO agent_knowledge_vectors (agent_id, text, embedding, metadata)
            VALUES (${agentId}, ${text}, ${JSON.stringify(embedding)}::vector, ${JSON.stringify(metadata)}::jsonb)
        `;
    }

    async searchSimilar(agentId: string, query: string, limit: number = 5, provider: string = 'ollama', apiKey?: string): Promise<any[]> {
        // Получаем embeddings для запроса
        const queryEmbedding = await this.embeddingService.getEmbeddings(query, provider, apiKey);

        // Ищем похожие векторы (cosine similarity)
        const results = await this.prisma.$queryRaw<any[]>`
            SELECT text, metadata,
                   1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
            FROM agent_knowledge_vectors
            WHERE agent_id = ${agentId}
            ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
            LIMIT ${limit}
        `;

        return results;
    }
}
```

**Document Processor**:

```typescript
// rag/services/document-processor.service.ts
import { Injectable } from '@nestjs/common';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { VectorStoreService } from './vector-store.service';

@Injectable()
export class DocumentProcessorService {
    constructor(
        private readonly vectorStore: VectorStoreService,
    ) {}

    async processFile(agentId: string, filePath: string, fileType: string, provider: string = 'ollama', apiKey?: string): Promise<void> {
        let loader;

        // Загружаем документ в зависимости от типа
        if (fileType === 'pdf') {
            loader = new PDFLoader(filePath);
        } else if (fileType === 'txt') {
            loader = new TextLoader(filePath);
        } else {
            throw new Error(`Unsupported file type: ${fileType}`);
        }

        const documents = await loader.load();

        // Разбиваем на чанки
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const chunks = await textSplitter.splitDocuments(documents);

        // Сохраняем каждый чанк в векторное хранилище
        for (const chunk of chunks) {
            await this.vectorStore.storeDocument(
                agentId,
                chunk.pageContent,
                { source: filePath, page: chunk.metadata.page },
                provider,
                apiKey
            );
        }
    }
}
```

**RAG Service**:

```typescript
// rag/services/rag.service.ts
import { Injectable } from '@nestjs/common';
import { VectorStoreService } from './vector-store.service';
import { LLMFactoryService } from '@/modules/llm';

@Injectable()
export class RAGService {
    constructor(
        private readonly vectorStore: VectorStoreService,
        private readonly llmFactory: LLMFactoryService,
    ) {}

    async generateWithRAG(agentId: string, query: string, agent: any): Promise<string> {
        // Ищем релевантные знания
        const relevantDocs = await this.vectorStore.searchSimilar(
            agentId,
            query,
            5,
            agent.llmProvider,
            agent.apiKey
        );

        // Формируем контекст из найденных документов
        const context = relevantDocs
            .map(doc => doc.text)
            .join('\n\n');

        // Формируем промпт с контекстом
        const prompt = `
${agent.rootPrompt}

Контекст из знаний агента:
${context}

Вопрос пользователя: ${query}

Ответь на вопрос, используя контекст из знаний агента. Если в контексте нет информации, ответь на основе своих знаний.
`;

        // Генерируем ответ через LLM
        const llmService = this.llmFactory.getService(agent.llmProvider);
        const response = await llmService.generate(prompt, {
            systemPrompt: agent.rootPrompt,
            apiKey: agent.apiKey,
            llmModel: agent.llmModel,
        });

        return response;
    }
}
```

### 3. Agent Service

**Основной сервис агентов**:

```typescript
// agents/services/agents.service.ts
import { Injectable } from '@nestjs/common';
import { AgentsRepository } from '../repositories/agents.repository';
import { RAGService } from '@/modules/rag';
import { LLMFactoryService } from '@/modules/llm';
import { AgentTaskService } from './agent-task.service';

@Injectable()
export class AgentsService {
    constructor(
        private readonly repository: AgentsRepository,
        private readonly ragService: RAGService,
        private readonly llmFactory: LLMFactoryService,
        private readonly taskService: AgentTaskService,
    ) {}

    async createAgent(ownerId: string, data: CreateAgentDto): Promise<Agent> {
        // Создаем User для агента (чтобы он мог иметь профиль)
        const user = await this.userService.createUser({
            name: data.name,
            email: `agent-${Date.now()}@agents.local`,
            password: crypto.randomBytes(32).toString('hex'), // Случайный пароль
            role: 'user',
        });

        // Создаем агента
        const agent = await this.repository.create({
            ...data,
            ownerId,
            userId: user.id,
        });

        return agent;
    }

    async processMessage(agentId: string, userId: string, message: string): Promise<string> {
        const agent = await this.repository.findById(agentId);
        if (!agent) {
            throw new Error('Agent not found');
        }

        // Сохраняем сообщение пользователя
        await this.repository.saveChatMessage({
            agentId,
            userId,
            content: message,
            isFromAgent: false,
        });

        // Генерируем ответ через RAG
        const response = await this.ragService.generateWithRAG(agentId, message, agent);

        // Сохраняем ответ агента
        await this.repository.saveChatMessage({
            agentId,
            userId,
            content: response,
            isFromAgent: true,
        });

        return response;
    }

    async processVoiceMessage(agentId: string, userId: string, audioBuffer: Buffer): Promise<Buffer> {
        // Транскрибируем аудио в текст (Whisper)
        const text = await this.transcribeAudio(audioBuffer);

        // Обрабатываем сообщение
        const response = await this.processMessage(agentId, userId, text);

        // Синтезируем речь (TTS)
        const audioResponse = await this.synthesizeSpeech(response);

        return audioResponse;
    }

    private async transcribeAudio(audioBuffer: Buffer): Promise<string> {
        // Используем Whisper API или локальный Whisper
        // Пример с OpenAI Whisper API
        const formData = new FormData();
        formData.append('file', new Blob([audioBuffer]), 'audio.webm');
        formData.append('model', 'whisper-1');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: formData,
        });

        const data = await response.json();
        return data.text;
    }

    private async synthesizeSpeech(text: string): Promise<Buffer> {
        // Используем TTS API (например, OpenAI TTS или другой)
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: 'alloy',
            }),
        });

        return Buffer.from(await response.arrayBuffer());
    }
}
```

### 4. Agent Task Service

**Сервис для выполнения заданий**:

```typescript
// agents/services/agent-task.service.ts
import { Injectable } from '@nestjs/common';
import { AgentsRepository } from '../repositories/agents.repository';
import { PostService } from '@/modules/post';
import { FollowService } from '@/modules/followers';
import { MessageService } from '@/modules/messages';

@Injectable()
export class AgentTaskService {
    constructor(
        private readonly repository: AgentsRepository,
        private readonly postService: PostService,
        private readonly followService: FollowService,
        private readonly messageService: MessageService,
    ) {}

    async executeTask(agentId: string, taskId: string): Promise<void> {
        const task = await this.repository.findTaskById(taskId);
        if (!task || task.agentId !== agentId) {
            throw new Error('Task not found');
        }

        // Обновляем статус на IN_PROGRESS
        await this.repository.updateTask(taskId, { status: 'IN_PROGRESS' });

        try {
            let result;

            switch (task.type) {
                case 'FOLLOW':
                    result = await this.executeFollowTask(agentId, task.params);
                    break;
                case 'LIKE':
                    result = await this.executeLikeTask(agentId, task.params);
                    break;
                case 'POST':
                    result = await this.executePostTask(agentId, task.params);
                    break;
                case 'MESSAGE':
                    result = await this.executeMessageTask(agentId, task.params);
                    break;
                default:
                    throw new Error(`Unknown task type: ${task.type}`);
            }

            // Обновляем статус на COMPLETED
            await this.repository.updateTask(taskId, {
                status: 'COMPLETED',
                result,
                completedAt: new Date(),
            });
        } catch (error) {
            // Обновляем статус на FAILED
            await this.repository.updateTask(taskId, {
                status: 'FAILED',
                error: error.message,
            });
        }
    }

    private async executeFollowTask(agentId: string, params: any): Promise<any> {
        const agent = await this.repository.findById(agentId);
        if (!agent || !agent.userId) {
            throw new Error('Agent not found');
        }

        await this.followService.follow(agent.userId, params.userId);
        return { success: true, userId: params.userId };
    }

    private async executeLikeTask(agentId: string, params: any): Promise<any> {
        const agent = await this.repository.findById(agentId);
        if (!agent || !agent.userId) {
            throw new Error('Agent not found');
        }

        await this.postService.likePost(agent.userId, params.postId);
        return { success: true, postId: params.postId };
    }

    private async executePostTask(agentId: string, params: any): Promise<any> {
        const agent = await this.repository.findById(agentId);
        if (!agent || !agent.userId) {
            throw new Error('Agent not found');
        }

        const post = await this.postService.createPost({
            userId: agent.userId,
            authorId: agent.userId,
            text: params.text,
        });

        return { success: true, postId: post.id };
    }

    private async executeMessageTask(agentId: string, params: any): Promise<any> {
        const agent = await this.repository.findById(agentId);
        if (!agent || !agent.userId) {
            throw new Error('Agent not found');
        }

        // Находим или создаем чат
        const chat = await this.findOrCreateChat(agent.userId, params.userId);

        await this.messageService.createMessage({
            chatId: chat.id,
            senderId: agent.userId,
            content: params.text,
        });

        return { success: true, chatId: chat.id };
    }
}
```

### 5. LiveKit интеграция для голосового общения

**Важно**: LiveKit сам по себе НЕ делает STT (speech-to-text) и TTS (text-to-speech). LiveKit - это платформа для передачи аудио/видео потоков. Нужно дополнительно интегрировать:
- **STT (Whisper)** - для транскрипции речи пользователя в текст
- **TTS (Text-to-Speech)** - для синтеза речи агента из текста
- **LiveKit Egress API** - для получения аудио потоков от пользователя
- **LiveKit Ingress API** - для отправки аудио ответов агента

**Архитектура голосового общения**:

```
Пользователь → LiveKit Room → Backend (Egress) → Whisper (STT) → LLM → TTS → Backend (Ingress) → LiveKit Room → Пользователь
```

**Генерация токенов для агентов**:

```typescript
// agents/services/agent-voice.service.ts
import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class AgentVoiceService {
    private readonly apiKey = process.env.LIVEKIT_API_KEY;
    private readonly apiSecret = process.env.LIVEKIT_API_SECRET;

    async generateAgentToken(agentId: string, userId: string): Promise<string> {
        const at = new AccessToken(this.apiKey, this.apiSecret, {
            identity: `agent-${agentId}`,
        });

        const roomName = `agent-${agentId}`;

        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
        });

        return at.toJwt();
    }

    async generateUserToken(agentId: string, userId: string): Promise<string> {
        const at = new AccessToken(this.apiKey, this.apiSecret, {
            identity: userId,
        });

        const roomName = `agent-${agentId}`;

        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
        });

        return at.toJwt();
    }
}
```

**Обработка аудио потоков через LiveKit Egress**:

```typescript
// agents/services/agent-voice.service.ts (продолжение)
import { LiveKitServer, EgressClient, IngressClient, RoomServiceClient } from 'livekit-server-sdk';
import { WhisperService } from './whisper.service';
import { TTSService } from './tts.service';
import { AgentsService } from './agents.service';

@Injectable()
export class AgentVoiceService {
    private readonly livekitUrl = process.env.LIVEKIT_URL || 'http://localhost:7880';
    private readonly roomService: RoomServiceClient;
    private readonly egressClient: EgressClient;
    private readonly ingressClient: IngressClient;

    constructor(
        private readonly whisperService: WhisperService,
        private readonly ttsService: TTSService,
        private readonly agentsService: AgentsService,
    ) {
        this.roomService = new RoomServiceClient(this.livekitUrl, this.apiKey, this.apiSecret);
        this.egressClient = new EgressClient(this.livekitUrl, this.apiKey, this.apiSecret);
        this.ingressClient = new IngressClient(this.livekitUrl, this.apiKey, this.apiSecret);
    }

    /**
     * Запускает обработку аудио потока от пользователя
     * Использует LiveKit Egress для получения аудио
     */
    async startVoiceProcessing(agentId: string, userId: string): Promise<void> {
        const roomName = `agent-${agentId}`;

        // Создаем Egress для записи аудио от пользователя
        const egress = await this.egressClient.startTrackCompositeEgress({
            roomName,
            output: {
                kind: 'webm',
                filepath: `agent-${agentId}-user-${userId}.webm`,
            },
            audioOnly: true,
            audioTrackId: `user-${userId}-audio`, // ID трека пользователя
        });

        // Обрабатываем аудио в реальном времени
        this.processAudioStream(agentId, userId, egress.egressId);
    }

    /**
     * Обрабатывает аудио поток в реальном времени
     */
    private async processAudioStream(agentId: string, userId: string, egressId: string): Promise<void> {
        // Получаем записанные чанки аудио
        // В реальности нужно использовать WebSocket или gRPC для стриминга

        // Вариант 1: Использовать WebSocket для получения аудио чанков
        // LiveKit поддерживает WebSocket для Egress

        // Вариант 2: Использовать файловый Egress и обрабатывать файлы
        // Менее эффективно, но проще в реализации

        // Для примера используем файловый подход с периодической проверкой
        setInterval(async () => {
            try {
                // Получаем статус Egress
                const egressInfo = await this.egressClient.getEgress(egressId);

                if (egressInfo.status === 'EGRESS_COMPLETE') {
                    // Файл готов, обрабатываем его
                    const audioBuffer = await this.downloadAudioFile(egressInfo.filepath);
                    await this.processAudioChunk(agentId, userId, audioBuffer);
                }
            } catch (error) {
                console.error('Error processing audio stream:', error);
            }
        }, 2000); // Проверяем каждые 2 секунды
    }

    /**
     * Обрабатывает чанк аудио: транскрибирует → обрабатывает через LLM → синтезирует ответ
     */
    private async processAudioChunk(agentId: string, userId: string, audioBuffer: Buffer): Promise<void> {
        // 1. Транскрибируем аудио в текст (Whisper)
        const transcript = await this.whisperService.transcribe(audioBuffer);

        if (!transcript || transcript.trim().length === 0) {
            return; // Нет речи в аудио
        }

        // 2. Обрабатываем текст через агента (LLM + RAG)
        const response = await this.agentsService.processMessage(agentId, userId, transcript);

        // 3. Синтезируем речь из ответа (TTS)
        const audioResponse = await this.ttsService.synthesize(response);

        // 4. Отправляем аудио ответ обратно в LiveKit через Ingress
        await this.sendAudioResponse(agentId, audioResponse);
    }

    /**
     * Отправляет аудио ответ агента в LiveKit через Ingress
     */
    private async sendAudioResponse(agentId: string, audioBuffer: Buffer): Promise<void> {
        const roomName = `agent-${agentId}`;

        // Создаем Ingress для отправки аудио
        const ingress = await this.ingressClient.createIngress({
            inputType: 'WHIP_INPUT',
            name: `agent-${agentId}-audio`,
            roomName,
            participantIdentity: `agent-${agentId}`,
            participantName: `Agent ${agentId}`,
        });

        // Отправляем аудио через WHIP (WebRTC HTTP Ingestion Protocol)
        // Используем библиотеку для отправки аудио потока
        await this.sendAudioViaWHIP(ingress.url, audioBuffer);
    }

    private async sendAudioViaWHIP(whipUrl: string, audioBuffer: Buffer): Promise<void> {
        // Используем WHIP клиент для отправки аудио
        // Это требует дополнительной библиотеки или реализации WHIP протокола
        // Альтернатива: использовать LiveKit SDK для создания аудио трека
    }
}
```

**Whisper Service (STT)**:

```typescript
// agents/services/whisper.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class WhisperService {
    private readonly openaiApiKey = process.env.OPENAI_API_KEY;
    private readonly whisperUrl = process.env.WHISPER_URL || 'http://localhost:9000'; // Локальный Whisper сервер

    /**
     * Транскрибирует аудио в текст
     * Варианты:
     * 1. OpenAI Whisper API (платно, но просто)
     * 2. Локальный Whisper сервер (бесплатно, но требует GPU)
     * 3. Другие STT сервисы (Google Speech-to-Text, Azure Speech, etc.)
     */
    async transcribe(audioBuffer: Buffer, language: string = 'ru'): Promise<string> {
        // Вариант 1: OpenAI Whisper API
        if (this.openaiApiKey) {
            return await this.transcribeWithOpenAI(audioBuffer, language);
        }

        // Вариант 2: Локальный Whisper сервер
        return await this.transcribeWithLocalWhisper(audioBuffer, language);
    }

    private async transcribeWithOpenAI(audioBuffer: Buffer, language: string): Promise<string> {
        const formData = new FormData();
        const blob = new Blob([audioBuffer], { type: 'audio/webm' });
        formData.append('file', blob, 'audio.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', language);

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.openaiApiKey}`,
            },
            body: formData,
        });

        const data = await response.json();
        return data.text;
    }

    private async transcribeWithLocalWhisper(audioBuffer: Buffer, language: string): Promise<string> {
        // Используем локальный Whisper сервер (например, на базе faster-whisper)
        const formData = new FormData();
        const blob = new Blob([audioBuffer], { type: 'audio/webm' });
        formData.append('file', blob, 'audio.webm');
        formData.append('language', language);

        const response = await fetch(`${this.whisperUrl}/transcribe`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.text;
    }
}
```

**TTS Service (Text-to-Speech)**:

```typescript
// agents/services/tts.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TTSService {
    private readonly openaiApiKey = process.env.OPENAI_API_KEY;
    private readonly ttsUrl = process.env.TTS_URL || 'http://localhost:8000'; // Локальный TTS сервер

    /**
     * Синтезирует речь из текста
     * Варианты:
     * 1. OpenAI TTS API (платно, но просто)
     * 2. Локальный TTS сервер (например, Coqui TTS, Piper)
     * 3. Другие TTS сервисы (Google Cloud TTS, Azure TTS, etc.)
     */
    async synthesize(text: string, voice: string = 'alloy', language: string = 'ru'): Promise<Buffer> {
        // Вариант 1: OpenAI TTS API
        if (this.openaiApiKey) {
            return await this.synthesizeWithOpenAI(text, voice);
        }

        // Вариант 2: Локальный TTS сервер
        return await this.synthesizeWithLocalTTS(text, voice, language);
    }

    private async synthesizeWithOpenAI(text: string, voice: string): Promise<Buffer> {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.openaiApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: voice, // alloy, echo, fable, onyx, nova, shimmer
            }),
        });

        return Buffer.from(await response.arrayBuffer());
    }

    private async synthesizeWithLocalTTS(text: string, voice: string, language: string): Promise<Buffer> {
        // Используем локальный TTS сервер
        const response = await fetch(`${this.ttsUrl}/synthesize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                voice,
                language,
            }),
        });

        return Buffer.from(await response.arrayBuffer());
    }
}
```

**Альтернативный подход: WebSocket для реального времени**:

```typescript
// agents/services/agent-voice-websocket.service.ts
import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { LiveKitServer } from 'livekit-server-sdk';

@Injectable()
export class AgentVoiceWebSocketService {
    /**
     * Подключается к LiveKit через WebSocket для получения аудио в реальном времени
     * Более эффективный подход, чем файловый Egress
     */
    async connectToLiveKitRoom(agentId: string, userId: string): Promise<void> {
        const roomName = `agent-${agentId}`;
        const wsUrl = `wss://${process.env.LIVEKIT_URL}/rtc`;

        // Подключаемся к LiveKit через WebSocket
        const ws = new WebSocket(wsUrl, {
            headers: {
                'Authorization': `Bearer ${await this.generateAgentToken(agentId, userId)}`,
            },
        });

        ws.on('message', async (data: Buffer) => {
            // Получаем аудио данные от пользователя
            const audioChunk = this.parseAudioChunk(data);

            if (audioChunk) {
                // Обрабатываем аудио чанк
                await this.processAudioChunk(agentId, userId, audioChunk);
            }
        });
    }

    /**
     * Отправляет аудио ответ обратно в LiveKit через WebSocket
     */
    private async sendAudioResponse(ws: WebSocket, audioBuffer: Buffer): Promise<void> {
        // Отправляем аудио данные через WebSocket
        ws.send(audioBuffer);
    }
}
```

**Упрощенный подход: Использование LiveKit Room Events**:

```typescript
// agents/services/agent-voice-room-events.service.ts
import { Injectable } from '@nestjs/common';
import { RoomServiceClient, WebhookReceiver } from 'livekit-server-sdk';

@Injectable()
export class AgentVoiceRoomEventsService {
    private readonly roomService: RoomServiceClient;
    private readonly webhookReceiver: WebhookReceiver;

    constructor(
        private readonly whisperService: WhisperService,
        private readonly ttsService: TTSService,
        private readonly agentsService: AgentsService,
    ) {
        this.roomService = new RoomServiceClient(
            process.env.LIVEKIT_URL!,
            process.env.LIVEKIT_API_KEY!,
            process.env.LIVEKIT_API_SECRET!
        );
        this.webhookReceiver = new WebhookReceiver(
            process.env.LIVEKIT_API_KEY!,
            process.env.LIVEKIT_API_SECRET!
        );
    }

    /**
     * Обрабатывает Webhook события от LiveKit
     * LiveKit отправляет события при подключении участников, публикации треков и т.д.
     */
    async handleLiveKitWebhook(req: any): Promise<void> {
        const event = this.webhookReceiver.receive(req.body, req.headers['authorization']);

        if (event.event === 'track_published') {
            // Пользователь опубликовал аудио трек
            if (event.track.kind === 'audio') {
                await this.handleUserAudioTrack(event.room.name, event.participant.identity, event.track);
            }
        }
    }

    /**
     * Обрабатывает аудио трек пользователя
     * Получаем аудио данные и обрабатываем их
     */
    private async handleUserAudioTrack(roomName: string, userId: string, track: any): Promise<void> {
        // Извлекаем agentId из roomName
        const agentId = roomName.replace('agent-', '');

        // Получаем аудио данные из трека
        // Это требует подключения к LiveKit через gRPC или WebSocket
        // Для упрощения можно использовать Egress для записи трека

        // Создаем Egress для записи этого трека
        const egress = await this.egressClient.startTrackEgress({
            roomName,
            trackId: track.sid,
            output: {
                kind: 'webm',
                filepath: `agent-${agentId}-user-${userId}-${Date.now()}.webm`,
            },
        });

        // Обрабатываем записанный файл
        // В реальности нужно использовать стриминг для обработки в реальном времени
    }
}
```

## API Endpoints

### Agents Controller

```typescript
// agents/agents.controller.ts
@Controller('agents')
export class AgentsController {
    constructor(
        private readonly agentsService: AgentsService,
        private readonly agentVoiceService: AgentVoiceService,
    ) {}

    @Get()
    async getAgents(@CurrentUser() user: User) {
        return await this.agentsService.getAgentsByOwner(user.id);
    }

    @Get(':id')
    async getAgent(@Param('id') id: string) {
        return await this.agentsService.getAgentById(id);
    }

    @Post()
    async createAgent(@CurrentUser() user: User, @Body() dto: CreateAgentDto) {
        return await this.agentsService.createAgent(user.id, dto);
    }

    @Patch(':id')
    async updateAgent(@Param('id') id: string, @Body() dto: UpdateAgentDto) {
        return await this.agentsService.updateAgent(id, dto);
    }

    @Post(':id/chat')
    async sendMessage(@Param('id') id: string, @CurrentUser() user: User, @Body() dto: AgentChatDto) {
        return await this.agentsService.processMessage(id, user.id, dto.message);
    }

    @Get(':id/chat/messages')
    async getChatMessages(@Param('id') id: string, @CurrentUser() user: User) {
        return await this.agentsService.getChatMessages(id, user.id);
    }

    @Post(':id/tasks')
    async createTask(@Param('id') id: string, @Body() dto: CreateTaskDto) {
        return await this.agentsService.createTask(id, dto);
    }

    @Get(':id/tasks')
    async getTasks(@Param('id') id: string) {
        return await this.agentsService.getTasks(id);
    }

    @Post(':id/voice/token')
    async getVoiceToken(@Param('id') id: string, @CurrentUser() user: User) {
        const token = await this.agentVoiceService.generateUserToken(id, user.id);
        return { token };
    }
}
```

## Зависимости

### Установка пакетов

```bash
# LangChain
npm install @langchain/core @langchain/community
npm install @langchain/ollama @langchain/openai

# Для RAG
npm install @langchain/community/document_loaders/fs/pdf
npm install langchain

# Для PostgreSQL + pgvector
npm install pg @prisma/client

# Для LiveKit
npm install livekit-server-sdk

# Для Whisper (опционально, можно использовать API)
# npm install @xenova/transformers
```

### Переменные окружения

```env
# Ollama
OLLAMA_URL=http://localhost:11434

# OpenAI (для Whisper и TTS)
OPENAI_API_KEY=your-api-key

# LiveKit
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# Whisper (если используется локальный сервер)
WHISPER_URL=http://localhost:9000

# TTS (если используется локальный сервер)
TTS_URL=http://localhost:8000

# PostgreSQL для векторов (если используется отдельная БД)
VECTOR_DB_URL=postgresql://user:password@localhost:5432/vectors
```

## Как работает голосовое общение с агентом

### Важно: LiveKit НЕ делает STT/TTS

**LiveKit** - это платформа для передачи аудио/видео потоков между участниками. Он НЕ транскрибирует речь и НЕ синтезирует речь. Это нужно реализовывать отдельно.

### Поток работы голосового общения

1. **Пользователь подключается к LiveKit Room**:
   - Frontend получает токен от backend
   - Подключается к LiveKit Room через `LiveKitRoom` компонент
   - Публикует свой аудио трек (микрофон)

2. **Backend получает аудио от пользователя**:
   - Использует **LiveKit Egress API** для получения аудио потока
   - Или подключается к LiveKit через **WebSocket/gRPC** для получения аудио в реальном времени
   - Получает аудио чанки от пользователя

3. **Backend транскрибирует аудио (STT)**:
   - Использует **Whisper** (OpenAI API или локальный сервер) для транскрипции
   - Получает текст из аудио

4. **Backend обрабатывает текст через агента**:
   - Использует **RAG** для поиска релевантных знаний
   - Генерирует ответ через **LLM** (Ollama, GigaChat, OpenAI)
   - Получает текстовый ответ

5. **Backend синтезирует речь (TTS)**:
   - Использует **TTS API** (OpenAI или локальный сервер) для синтеза речи
   - Получает аудио файл с речью агента

6. **Backend отправляет аудио обратно в LiveKit**:
   - Использует **LiveKit Ingress API** для отправки аудио потока
   - Или публикует аудио трек через **WebSocket/gRPC**
   - Аудио доставляется пользователю через LiveKit Room

7. **Пользователь слышит ответ агента**:
   - Frontend получает аудио трек от агента через LiveKit
   - Воспроизводит аудио через `RoomAudioRenderer`

### Схема архитектуры

```
┌─────────────┐
│  Frontend   │
│  (User)     │
└──────┬──────┘
       │
       │ WebRTC (LiveKit)
       │
┌──────▼──────────────────────────────────────┐
│           LiveKit Server                    │
│  - Получает аудио от пользователя           │
│  - Передает аудио в backend (Egress)        │
│  - Получает аудио от backend (Ingress)      │
│  - Передает аудио пользователю               │
└──────┬──────────────────────────────────────┘
       │
       │ Egress API / WebSocket
       │
┌──────▼──────────────────────────────────────┐
│              Backend                         │
│                                              │
│  ┌──────────────┐    ┌──────────────┐       │
│  │   Whisper    │    │     TTS      │       │
│  │    (STT)     │    │  (Synthesis)  │       │
│  └──────┬───────┘    └──────┬───────┘       │
│         │                  │                │
│         ▼                  ▼                │
│  ┌─────────────────────────────────────┐    │
│  │      Agent Processing               │    │
│  │  - RAG (поиск знаний)               │    │
│  │  - LLM (генерация ответа)           │    │
│  └─────────────────────────────────────┘    │
└──────┬──────────────────────────────────────┘
       │
       │ Ingress API / WebSocket
       │
┌──────▼──────────────────────────────────────┐
│           LiveKit Server                    │
│  - Получает аудио от backend                │
│  - Передает аудио пользователю               │
└──────┬──────────────────────────────────────┘
       │
       │ WebRTC (LiveKit)
       │
┌──────▼──────┐
│  Frontend   │
│  (User)     │
└─────────────┘
```

## Связанные задачи

- [Frontend задача по AI агентам](../../frontend/tasks/ai-agents.md) - **обязательно** - frontend реализация
- [Переход чатов с WebRTC на LiveKit](../frontend/tasks/livekit-migration.md) - использование LiveKit

## Этапы реализации

### Этап 1: База данных

- [ ] Добавить модели Agent, AgentKnowledgeFile, AgentTask, AgentChatMessage в Prisma
- [ ] Создать миграцию
- [ ] Настроить PostgreSQL + pgvector для векторов (или использовать альтернативу)

### Этап 2: LLM модуль

- [ ] Создать интерфейс ILLMService
- [ ] Реализовать OllamaService
- [ ] Реализовать GigaChatService
- [ ] Реализовать OpenAIService
- [ ] Создать LLMFactoryService

### Этап 3: RAG модуль

- [ ] Реализовать EmbeddingService
- [ ] Реализовать VectorStoreService
- [ ] Реализовать DocumentProcessorService
- [ ] Реализовать RAGService

### Этап 4: Agents модуль

- [ ] Создать AgentsService
- [ ] Реализовать CRUD операции для агентов
- [ ] Реализовать обработку сообщений
- [ ] Реализовать обработку голосовых сообщений

### Этап 5: Tasks модуль

- [ ] Создать AgentTaskService
- [ ] Реализовать выполнение заданий (FOLLOW, LIKE, POST, MESSAGE)
- [ ] Реализовать очередь заданий

### Этап 6: LiveKit интеграция

- [ ] Реализовать AgentVoiceService
- [ ] Интегрировать с LiveKit для голосовых звонков
- [ ] Реализовать обработку аудио потоков

### Этап 7: API Endpoints

- [ ] Создать AgentsController
- [ ] Реализовать все endpoints
- [ ] Добавить валидацию и обработку ошибок

### Этап 8: Тестирование

- [ ] Протестировать создание и настройку агентов
- [ ] Протестировать RAG функционал
- [ ] Протестировать обработку сообщений
- [ ] Протестировать выполнение заданий
- [ ] Протестировать голосовое общение
