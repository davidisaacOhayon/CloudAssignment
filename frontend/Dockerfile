FROM node:20.6.0

ENV BACKEND_URL="https://backend-dot-davidassignment.nw.r.appspot.com"
WORKDIR /webapp

COPY package.json package-lock.json /webapp/

RUN npm install

COPY . . 

RUN npm run build

RUN npm install -g serve

CMD ["sh", "-c", "serve -s build -l $PORT"]
