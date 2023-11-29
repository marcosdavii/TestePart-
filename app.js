const express = require('express');

const app = express();
const path = require('path');
const PORT = 3000;

 app.use(express.static(path.join(__dirname, '/')));

app.listen(PORT, () => {
  console.log(`O servidor está rodando em http://localhost:${PORT}`);
}); 

function isValidPassword(password, requireExactlyTwoAdjacent) {
  const digits = password.toString().split('').map(Number);

  let hasAdjacent = false;
  let isIncreasing = true;

  for (let i = 1; i < digits.length; i++) {
    if (digits[i] === digits[i - 1]) {
      hasAdjacent = true;

      if (requireExactlyTwoAdjacent) {
        if (
          (i < 2 || digits[i - 2] !== digits[i]) &&
          (i + 1 >= digits.length || digits[i + 1] !== digits[i])
        ) {
          return true;
        }
      }
    }

    if (digits[i] < digits[i - 1]) {
      isIncreasing = false;
      break;
    }
  }

  return hasAdjacent && isIncreasing;
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateValidPassword(requireExactlyTwoAdjacent) {
  const minRange = 184759;
  const maxRange = 856920;

  let password;
  do {
    password = generateRandomNumber(minRange, maxRange);
  } while (!isValidPassword(password, requireExactlyTwoAdjacent));

  return password;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/countPasswords', (req, res) => {
  const minRange = 184759;
  const maxRange = 856920;

  let countPart1 = 0;
  let countPart2 = 0;

  for (let password = minRange; password <= maxRange; password++) {
    if (isValidPassword(password, false)) {
      countPart1++;
    }

    if (isValidPassword(password, true)) {
      countPart2++;
    }
  }

  res.json({ contagemPart1: countPart1, contagemPart2: countPart2 });
});

app.get('/generatePassword', (req, res) => {
  const requerExatamenteDoisAdjacentes = req.query.requerExatamenteDoisAdjacentes === 'true';
  const senha = generateValidPassword(requerExatamenteDoisAdjacentes);
  res.json({ senha: senha });
});


function executeCommands(commands) {
  let address = 0;
  let currentIndex = 0;

  while (currentIndex < commands.length) {
    const command = commands[currentIndex];

    if (command.startsWith('20')) {
      const increment = parseInt(command.substring(2));
      address += increment;
    } else if (command.startsWith('5')) {
      const jumpLength = parseInt(command.substring(1));

      if (jumpLength === 1) {
        currentIndex++;
      } else if (jumpLength === 2) {
        currentIndex += 2;
      } else {
        currentIndex += jumpLength;
      }
    }

    currentIndex++;
  }

  return address;
}

app.get('/', (req, res) => {
  const fileContent = fs.readFileSync('commands.txt', 'utf-8');
  const commands = fileContent.split('\n').map(line => line.trim());
  const result = executeCommands(commands);

  res.send(`<h1>Valor final da variável de endereço:</h1><p>${result}</p>`);
});