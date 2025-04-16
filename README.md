
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)


# Log Hopper

Filter and give data to system Managment Dashbords


## Features
 
- [ ] read logs from different systems via api
- [ ] analyze and filter logs 
- [ ] permanet filter rules
- [ ] simple UI
- [ ] User Authentication and Authorization
- [ ] prepare filtered logs for checkmk, zabbix and grafana 
- [ ] send logs as usable data to those systems  

## Roadmap
- [ ] client agent (set up which logs in which intervals get set via generate script)
## Tech Stack

- Docker

**Server/Backend**
- Node
- Express JS
- Typescript

**Frontend**
- alpine js
- Tailwind css

**Databses**
- MariaDB/Redis

## Documentation

[Documentation]()


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`


## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```
    
## Run Locally / Dev install

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

