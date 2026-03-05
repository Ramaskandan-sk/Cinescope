import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const killPort = async (port) => {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`)
    
    // Windows command
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`)
    
    if (stdout) {
      const lines = stdout.trim().split('\n')
      const pids = new Set()
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/)
        const pid = parts[parts.length - 1]
        if (pid && !isNaN(pid)) {
          pids.add(pid)
        }
      })
      
      for (const pid of pids) {
        console.log(`💀 Killing process ${pid}...`)
        await execAsync(`taskkill /F /PID ${pid}`)
      }
      
      console.log(`✅ Port ${port} is now free!`)
    } else {
      console.log(`✅ Port ${port} is already free!`)
    }
  } catch (error) {
    if (error.stdout === '') {
      console.log(`✅ Port ${port} is free!`)
    } else {
      console.error('Error:', error.message)
    }
  }
}

const port = process.env.PORT || 5000
killPort(port)
