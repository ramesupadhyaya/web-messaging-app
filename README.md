# Web Messages

## It lets you send text message to any number in the world, You can also get the reply from US numbers!


### How to use?

1. Go To ubuntu@ec2-3-128-95-67.us-east-2.compute.amazonaws.com
2. Add Any number with Country Code.
3. Send Text message to that number.
4. Get Notification on reply. 
5. The app runs based on a single session


### Steps You need to follow to start the server in local

Prerequisites

 =>  Considering System is having Node (latest), NPM and if you are trying to run with docker then docker-compose.

1. Open Terminal in root directory of the project
2. Hit npm run install:all
3. Hit npm run frontend => to Start frontend
4. Hit npm run server:docker => to start server in docker or npm run server to start node process
5. The two way communication is not possible while running the app locally without using tunnel (this can be achieved via postman or using tunnel like ngrok, which requires detail configuration such as twilio account details)

Sample Postman POST request

Endpoint: 
localhost:8081/api/sms/reply

Request body:
```
{
  "Body": "ramesh test",
  "From": "+17134707851"
}
```

Open URL http://localhost:8080.


## Enjoy!



