# Используем официальный образ LiveKit
FROM livekit/livekit-server:latest

ARG LIVEKIT_API_KEY
ARG LIVEKIT_API_SECRET

ENV LIVEKIT_API_KEY=${LIVEKIT_API_KEY}
ENV LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}
# Копируем конфиг (создадим его ниже)
COPY livekit.yaml /etc/livekit.yaml

# Запускаем сервер с конфигом
CMD ["--config", "/etc/livekit.yaml"]
