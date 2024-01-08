ARG NODE_VERSION=21.4.0

FROM node:${NODE_VERSION}-alpine as builder

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV STAGE=production

RUN apk add --no-cache python3 py3-pip make build-base \
                       gcc libc-dev libffi-dev abuild \
                       binutils binutils-doc gcc-doc \
                       linux-headers tini

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY apps/api/package.json apps/api/package.json
COPY apps/editor/package.json apps/editor/package.json

COPY packages/literals/package.json package/literals/package.json

RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev


COPY . .

RUN npx ultra-runner --r --build

FROM builder as api

EXPOSE 8080
WORKDIR /usr/src/app/apps/api

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["npm", "run", "start"]

FROM pierrezemb/gostatic as editor

EXPOSE 8043

COPY --from=builder /usr/src/app/apps/editor/dist/ /srv/http/
