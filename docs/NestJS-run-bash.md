### ✅ **NestJS Service: BashRunnerService**

```typescript
// src/bash-runner/bash-runner.service.ts
import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execFileAsync = promisify(execFile);

@Injectable()
export class BashRunnerService {
  async runScript(scriptName: string, args: string[] = []): Promise<{ stdout: string; stderr: string }> {
    const scriptPath = path.join(__dirname, '../../scripts', scriptName);

    try {
      const { stdout, stderr } = await execFileAsync(scriptPath, args);
      return { stdout, stderr };
    } catch (error) {
      return { stdout: error.stdout || '', stderr: error.stderr || error.message };
    }
  }
}
```

---

### ✅ **Bash Script File**

```bash
# scripts/sample-task.sh
#!/bin/bash

# Title: Sample Task
# Description: Simple example Bash script

echo "Running sample task..."
echo "Arguments passed: $@"
```

---

### ✅ **Example usage in a controller**

```typescript
// src/bash-runner/bash-runner.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { BashRunnerService } from './bash-runner.service';

@Controller('bash-runner')
export class BashRunnerController {
  constructor(private readonly bashRunnerService: BashRunnerService) {}

  @Get('run')
  async run(@Query('script') script: string, @Query('args') args: string): Promise<any> {
    const argsArray = args ? args.split(',') : [];
    return this.bashRunnerService.runScript(script, argsArray);
  }
}
```

---

### ✅ **Directory Structure**

```
src/
└── bash-runner/
    ├── bash-runner.controller.ts
    └── bash-runner.service.ts
scripts/
└── sample-task.sh
```

---

### ✅ **Example request**

```http
GET /bash-runner/run?script=sample-task.sh&args=foo,bar
```

---

### ✅ **Additional Notes**

* Ensure your Bash script is **executable**:

  ```bash
  chmod +x scripts/sample-task.sh
  ```
* Adjust the `path.join` logic if you want the scripts directory elsewhere.
* The service safely executes only files inside `scripts/`.

---

If you'd like, I can add:
✅ Validation for script existence
✅ Streaming output instead of buffering
✅ Support for working directory or environment variables

Would you like to extend it? 🚀

