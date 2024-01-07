ARG NODE_VERSION=21.4.0

FROM node:${NODE_VERSION}-alpine as builder

WORKDIR /usr/src/app

ENV NODE_ENV production
RUN apk add --no-cache python3 py3-pip make build-base \
                       gcc libc-dev libffi-dev abuild \
                       binutils binutils-doc gcc-doc \
                       linux-headers tini

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY apps/api/package.json apps/api/package.json
COPY apps/editor/package.json apps/editor/package.json

COPY packages/domain/package.json package/domain/package.json
COPY packages/ui/package.json package/ui/package.json
COPY packages/literals/package.json package/literals/package.json

RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

COPY . .

RUN npx ultra-runner --r --build

FROM builder as dev-api

EXPOSE 3000

ENV NODE_ENV=development
ENV STAGE=development

ENTRYPOINT ["/sbin/tini", "--"]
CMD make dev

FROM builder as dev-editor

EXPOSE 3001

ENV NODE_ENV=development

ENTRYPOINT ["/sbin/tini", "--"]
CMD make dev


FROM flashspys/nginx-static as prod-editor

ENV NODE_ENV=production
ENV STAGE=production

COPY --from=builder /usr/src/app/apps/editor/dist /static
