#!/usr/bin/env bash
sudo certbot -n -d $DOMAIN --nginx --agree-tos --email $DOMAIN_EMAIL
sudo systemctl restart nginx

