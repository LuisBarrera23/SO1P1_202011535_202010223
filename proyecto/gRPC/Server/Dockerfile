FROM node:14

WORKDIR /app

COPY mysql_connection.js .
COPY gRPC_server.js .
COPY proto ./proto

RUN npm install @grpc/grpc-js @grpc/proto-loader async google-protobuf lodash minimist mysql

EXPOSE 50051

CMD ["node", "gRPC_server.js"]