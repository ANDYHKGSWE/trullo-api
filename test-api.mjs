import http from 'http';

let authToken = '';
let userId = '';

const registerUser = () => {
  const data = JSON.stringify({
    name: "Test User",
    email: "testuser@example.com",
    password: "password123"
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`REGISTER STATUS: ${res.statusCode}`);
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
    res.on('end', () => {
      console.log(`REGISTER RESPONSE: ${responseBody}`);
      if (res.statusCode === 201) {
        const response = JSON.parse(responseBody);
        userId = response[0]._id; 
        loginUser();
      } else {
        loginUser();
      }
    });
  });

  req.on('error', (e) => {
    console.error(`problem with registration request: ${e.message}`);
  });

  req.write(data);
  req.end();
};

const loginUser = () => {
  const data = JSON.stringify({
    email: "testuser@example.com",
    password: "password123"
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`LOGIN STATUS: ${res.statusCode}`);
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
    res.on('end', () => {
      console.log(`LOGIN RESPONSE: ${responseBody}`);
      const response = JSON.parse(responseBody);
      authToken = response.token;
      
      if (!userId) {
        fetchUserId();
      } else {
        createTask();
      }
    });
  });

  req.on('error', (e) => {
    console.error(`problem with login request: ${e.message}`);
  });

  req.write(data);
  req.end();
};

const fetchUserId = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`FETCH USER ID STATUS: ${res.statusCode}`);
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
    res.on('end', () => {
      console.log(`FETCH USER ID RESPONSE: ${responseBody}`);
      const users = JSON.parse(responseBody);
      const user = users.find(u => u.email === "testuser@example.com");
      if (user) {
        userId = user._id;
        createTask();
      }
    });
  });

  req.on('error', (e) => {
    console.error(`problem with fetch user ID request: ${e.message}`);
  });

  req.end();
};

const createTask = () => {
  const data = JSON.stringify({
    title: "Test Task",
    description: "This is a test task",
    status: "To Do",
    assignedTo: userId 
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/tasks',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': `Bearer ${authToken}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`CREATE TASK STATUS: ${res.statusCode}`);
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
    res.on('end', () => {
      console.log(`CREATE TASK RESPONSE: ${responseBody}`);
      getAllTasks();
    });
  });

  req.on('error', (e) => {
    console.error(`problem with create task request: ${e.message}`);
  });

  req.write(data);
  req.end();
};

const getAllTasks = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/tasks',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`GET ALL TASKS STATUS: ${res.statusCode}`);
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
    res.on('end', () => {
      console.log(`GET ALL TASKS RESPONSE: ${responseBody}`);
    });
  });

  req.on('error', (e) => {
    console.error(`problem with get all tasks request: ${e.message}`);
  });

  req.end();
};

registerUser();
