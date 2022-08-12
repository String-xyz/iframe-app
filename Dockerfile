FROM alpine:3.10.3

LABEL maintainer="Marlon Monroy<marlon@string.xyz>"
LABEL Description="String iFrame and JS SDK"
EXPOSE 3000
# Copy over the app files
COPY ./cmd/app/main /app/
COPY ./templates /app/templates
COPY ./public/build /app/public/build
WORKDIR /app

CMD ["./main"]

