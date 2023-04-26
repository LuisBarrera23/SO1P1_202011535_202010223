FROM golang

WORKDIR /redispub

COPY . .

RUN go mod download

EXPOSE 8082

CMD ["go", "run", "main.go"]