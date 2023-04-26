FROM golang

WORKDIR /redissub

COPY . .

RUN go mod download

CMD ["go", "run", "main.go"]