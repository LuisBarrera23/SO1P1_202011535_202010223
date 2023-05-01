FROM node:14

WORKDIR /app

COPY gRPC_client.js .
COPY api_server.js .
COPY proto ./proto

RUN npm install @grpc/grpc-js @grpc/proto-loader async google-protobuf lodash minimist express morgan cors

EXPOSE 7070

CMD ["node", "api_server.js"]