// modules/queue/queue-dispatcher.service.ts
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { QueueNames } from '../consts/queue-names.enum';
import { JobNames } from '../consts/job-names.enum';


@Injectable()
export class QueueDispatcherService {
    private readonly logger = new Logger(QueueDispatcherService.name);

    constructor(
        @InjectQueue(QueueNames.MAIL) private readonly mailQueue: Queue,

    ) {
        this.logger.log('QueueDispatcherService initialized');
    }

    async dispatch<T>(
        queueName: QueueNames,
        jobName: JobNames,
        data: any,
        jobId?: string,
    ): Promise<Job<T>> {
        const queue = this.getQueue(queueName);
        this.logger.log(`Dispatching job ${jobName} to queue ${queueName}`);
        this.logger.log(`Job data: ${JSON.stringify(data)}`);
        const job = jobId
            ? await queue.add(jobName, data, { jobId })
            : await queue.add(jobName, data);
        this.logger.log('Job added to queue');
        return job;
    }

    getQueue(name: QueueNames): Queue {
        this.logger.log(`Getting queue: ${name}`);
        switch (name) {
            case QueueNames.MAIL:
                return this.mailQueue;

            default:
                const error = `Unknown queue name: ${name}`;
                this.logger.error(error);
                throw new Error(error);
        }
    }

    async getJob(queueName: QueueNames, id: string): Promise<Job | null> {
        const queue = this.getQueue(queueName);
        return await queue.getJob(id);
    }
}
