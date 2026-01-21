FROM caddy:latest

# Copy the Caddyfile configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Expose ports
EXPOSE 80 443 443/udp

# The default CMD from the base image will start Caddy
# with the Caddyfile we've copied
