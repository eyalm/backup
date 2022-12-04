FROM artifactory.rafael.co.il:6001/node:16.16-alpine3.16 as base
WORKDIR /app
COPY . .

FROM base AS development

ENV NODE_ENV development
#Next line will create ..npmrc with our private repository
#JENKINS
# install node packages

RUN npm install --legacy-peer-deps

#build service
RUN npm run build

FROM development as test

RUN npm run test:full --ci --
RUN mkdir -p /tmp/jenkins/workspace && cp test-report.xml /tmp/jenkins/workspace/test-report.xml

#Buildiing production mode docker
FROM base as production

#Next line will create ..npmrc with our private repository
#JENKINS
# install node packages production mode
RUN npm install --legacy-peer-deps --only=production

#Building final docker with consul-template
FROM artifactory.rafael.co.il:6001/hashicorp/consul-template:0.27.2 as consul-template
FROM artifactory.rafael.co.il:6001/node:16.16-alpine3.16 as release

WORKDIR /app

COPY --from=production --chown=node:node /app/node_modules ./node_modules
COPY --from=development --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json /app
COPY --chown=node:node ./config ./config
COPY --from=consul-template /bin/consul-template /bin/consul-template

USER node

CMD ["npm", "start"]
