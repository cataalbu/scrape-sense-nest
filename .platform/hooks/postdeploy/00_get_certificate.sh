#!/usr/bin/env bash
CUSTOM_NGINX_CONF='/etc/nginx/conf.d/custom.conf'
echo 'server_names_hash_bucket_size 128;' | sudo tee $CUSTOM_NGINX_CONF
echo 'types_hash_max_size 2048;' | sudo tee -a $CUSTOM_NGINX_CONF
echo 'types_hash_bucket_size 128;' | sudo tee -a $CUSTOM_NGINX_CONF
sudo certbot -n -d $DOMAIN --nginx --agree-tos --email $DOMAIN_EMAIL
sudo systemctl restart nginx


