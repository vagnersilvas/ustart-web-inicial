FROM nginx:1.19.8-alpine

LABEL Maintainer="Rafael Da Silva <silvagpe@gmail.com>" \
      Description="UStart - Nginx 1.19.x-alpine"


# Pasta de trabalho
WORKDIR /app

# Configurações do nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

COPY docker/dist/. .

# Porta de trabalho do NGINX
EXPOSE 80

# Inicia nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Configuração de healthcheck 
HEALTHCHECK --timeout=10s CMD curl --silent --fail http://127.0.0.1:80/
