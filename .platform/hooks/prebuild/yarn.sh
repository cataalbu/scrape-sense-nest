# add yarn
sudo wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo 
#install yarn
sudo yum -y install yarn
# install dependencies
cd /var/app/staging/
yarn