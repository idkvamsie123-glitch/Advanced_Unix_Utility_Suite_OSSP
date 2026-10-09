/**
 * ============================================================================
 * UNIXSUITE VISUAL LAB & INTERACTIVE OS SUITE - APPLICATION CORE
 * Integrated Linux System Programming & Educational Interactive Toolkit
 * ============================================================================
 */

// Global App State
const state = {
  theme: 'dark',
  activeTab: 'dashboard',
  commandHistory: [],
  historyIndex: -1,
  mutexEnabled: true,
  isRaceRunning: false,
  processStep: 0,
  quizCurrentIndex: 0,
  quizScore: 0,
  virtualFiles: {
    'test.txt': {
      size: 851,
      mode: '0644',
      uid: 1000,
      gid: 1000,
      nlink: 1,
      content: 'ADVANCED UNIX UTILITY SUITE\n===========================\nComplete combined backend for Review 2.\nSystem Programming Toolkit featuring 6 core OS modules.'
    },
    'kernel.log': {
      size: 1240,
      mode: '0600',
      uid: 0,
      gid: 0,
      nlink: 1,
      content: '[0.000000] Linux version 6.6.137-microsoft-standard-WSL2\n[0.000001] Command line: initrd=\\initrd.img panic=-1\n[0.000002] Memory: 16384MB available\n[0.000003] SMP: 16 online processors detected'
    },
    'data.bin': {
      size: 4096,
      mode: '0755',
      uid: 1000,
      gid: 1000,
      nlink: 2,
      content: '0x7F 0x45 0x4C 0x46 (ELF 64-bit LSB executable, x86-64, POSIX compliant)'
    }
  }
};

// C Source Code Repository for Code Viewer
const sourceFiles = {
  'main.c': `#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "system_info.h"
#include "process_manager.h"
#include "file_system.h"
#include "ipc.h"
#include "memory.h"
#include "concurrency.h"

#define MAX_INPUT 256

void display_banner(void)
{
    printf("\\n===============================================\\n");
    printf("          ADVANCED UNIX UTILITY SUITE         \\n");
    printf("===============================================\\n");
    printf(" Integrated Linux System Programming Toolkit\\n");
    printf(" Type 'help' to see available commands.\\n");
    printf(" Type 'exit' to quit.\\n");
    printf("===============================================\\n\\n");
}

int main(void)
{
    char input[MAX_INPUT];
    display_banner();

    while (1) {
        printf("UnixSuite > ");
        if (fgets(input, sizeof(input), stdin) == NULL) break;
        input[strcspn(input, "\\n")] = '\\0';
        if (strlen(input) == 0) continue;

        if (strcmp(input, "exit") == 0) break;
        else if (strcmp(input, "system-info") == 0) display_system_info();
        else if (strcmp(input, "processes") == 0) process_demo();
        else if (strncmp(input, "file-info ", 10) == 0) file_info(input + 10);
        else if (strncmp(input, "read-file ", 10) == 0) read_file(input + 10);
        else if (strncmp(input, "create-file ", 12) == 0) create_file(input + 12);
        else if (strcmp(input, "ipc-demo") == 0) ipc_demo();
        else if (strcmp(input, "signal-demo") == 0) signal_demo();
        else if (strcmp(input, "memory-info") == 0) memory_info();
        else if (strcmp(input, "memory-maps") == 0) memory_maps();
        else if (strcmp(input, "thread-demo") == 0) thread_demo();
        else if (strcmp(input, "help") == 0) display_help();
        else if (strcmp(input, "clear") == 0) system("clear");
        else printf("[ERROR] Unknown command: %s\\n", input);
    }
    return 0;
}`,
  'system_info.c': `#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <unistd.h>
#include <sys/utsname.h>
#include "system_info.h"

void display_system_info(void)
{
    struct utsname info;
    long cores, page_size, physical_pages;

    printf("\\n===============================================\\n");
    printf("             SYSTEM INFORMATION               \\n");
    printf("===============================================\\n");
    printf("\\n[INTERNAL WORKING]\\nUnixSuite is communicating with Linux through POSIX/Linux system interfaces.\\n");

    if (uname(&info) == -1) { perror("uname"); return; }

    printf("\\n[1] Operating System Information\\n");
    printf("-----------------------------------------------\\n");
    printf("System      : %s\\n", info.sysname);
    printf("Node Name   : %s\\n", info.nodename);
    printf("Kernel      : %s\\n", info.release);
    printf("Version     : %s\\n", info.version);
    printf("Architecture: %s\\n", info.machine);

    cores = sysconf(_SC_NPROCESSORS_ONLN);
    printf("\\n[2] CPU Information\\n-----------------------------------------------\\n");
    printf("Available CPU Cores : %ld\\n", cores);

    page_size = sysconf(_SC_PAGESIZE);
    physical_pages = sysconf(_SC_PHYS_PAGES);

    printf("\\n[3] Memory Information\\n-----------------------------------------------\\n");
    printf("Page Size         : %ld bytes\\n", page_size);
    printf("Physical Pages    : %ld\\n", physical_pages);
    if (page_size > 0 && physical_pages > 0) {
        double total_gb = ((double)page_size * (double)physical_pages) / (1024.0 * 1024.0 * 1024.0);
        printf("Approx. Total RAM : %.2f GB\\n", total_gb);
    }
    printf("\\n===============================================\\n");
}`,
  'process_manager.c': `#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>
#include "process_manager.h"

void process_demo(void)
{
    pid_t pid;
    int status;

    printf("\\n===============================================\\n");
    printf("              PROCESS MANAGER                 \\n");
    printf("===============================================\\n");
    printf("\\nSTEP 1: fork() creates a new child process.\\n");

    pid = fork();
    if (pid < 0) { perror("[ERROR] fork()"); return; }

    if (pid == 0) {
        printf("\\n[CHILD PROCESS]\\nChild PID  : %d\\nParent PID : %d\\n", getpid(), getppid());
        printf("\\nSTEP 2: exec() replaces current child program image.\\n");
        execlp("echo", "echo", "[Child] exec() successfully executed a new program!", (char *)NULL);
        perror("[ERROR] exec()");
        _exit(1);
    }

    printf("\\n[PARENT PROCESS]\\nParent PID : %d\\nChild PID  : %d\\n", getpid(), pid);
    printf("\\nSTEP 3: wait() blocks parent until child finishes.\\n");
    if (waitpid(pid, &status, 0) == -1) { perror("[ERROR] wait()"); return; }
    if (WIFEXITED(status)) {
        printf("[Parent] Child completed normally. Exit status: %d\\n", WEXITSTATUS(status));
    }
}`,
  'file_system.c': `#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <errno.h>
#include "file_system.h"

void file_info(const char *filename) {
    struct stat st;
    if (stat(filename, &st) == -1) { perror("[ERROR] stat()"); return; }
    printf("\\nFile: %s\\n", filename);
    printf("Size       : %ld bytes\\n", (long)st.st_size);
    printf("Permissions: %o\\n", st.st_mode & 0777);
    printf("Owner UID  : %d | Group GID: %d\\n", st.st_uid, st.st_gid);
    printf("Links      : %ld\\n", (long)st.st_nlink);
}

void read_file(const char *filename) {
    int fd = open(filename, O_RDONLY);
    char buffer[512];
    ssize_t bytes_read;
    if (fd == -1) { perror("[ERROR] open()"); return; }
    printf("[INTERNAL] File opened successfully. FD: %d\\n", fd);
    while ((bytes_read = read(fd, buffer, sizeof(buffer) - 1)) > 0) {
        buffer[bytes_read] = '\\0';
        printf("%s", buffer);
    }
    close(fd);
    printf("\\n[INTERNAL] close(%d) released file descriptor.\\n", fd);
}`,
  'ipc.c': `#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <signal.h>
#include <string.h>
#include "ipc.h"

static volatile sig_atomic_t signal_received = 0;
static void handle_sigusr1(int sig) { (void)sig; signal_received = 1; }

void ipc_demo(void) {
    int pipefd[2];
    pid_t pid;
    char buffer[128];
    if (pipe(pipefd) == -1) { perror("[ERROR] pipe()"); return; }
    printf("Read FD: %d | Write FD: %d\\n", pipefd[0], pipefd[1]);
    pid = fork();
    if (pid == 0) {
        const char *msg = "Hello from child process through pipe!";
        close(pipefd[0]);
        write(pipefd[1], msg, strlen(msg) + 1);
        close(pipefd[1]);
        _exit(0);
    }
    close(pipefd[1]);
    ssize_t bytes = read(pipefd[0], buffer, sizeof(buffer) - 1);
    if (bytes > 0) { buffer[bytes] = '\\0'; printf("Message received: %s\\n", buffer); }
    close(pipefd[0]);
    waitpid(pid, NULL, 0);
}`,
  'memory.c': `#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include "memory.h"

void memory_info(void) {
    FILE *file = fopen("/proc/self/status", "r");
    char line[256];
    if (file == NULL) { perror("[ERROR] fopen()"); return; }
    while (fgets(line, sizeof(line), file) != NULL) {
        if (strncmp(line, "VmSize:", 7) == 0 || strncmp(line, "VmRSS:", 6) == 0 ||
            strncmp(line, "VmPeak:", 7) == 0 || strncmp(line, "VmData:", 7) == 0) {
            printf("%s", line);
        }
    }
    fclose(file);
    printf("Page Size: %ld bytes\\n", sysconf(_SC_PAGESIZE));
}`,
  'concurrency.c': `#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <pthread.h>
#include "concurrency.h"

#define ITERATIONS 100000
static long shared_counter = 0;
static pthread_mutex_t counter_mutex = PTHREAD_MUTEX_INITIALIZER;

static void *worker(void *arg) {
    for (int i = 0; i < ITERATIONS; i++) {
        pthread_mutex_lock(&counter_mutex);
        shared_counter++;
        pthread_mutex_unlock(&counter_mutex);
    }
    return NULL;
}

void thread_demo(void) {
    pthread_t thread1, thread2;
    long id1 = 1, id2 = 2;
    shared_counter = 0;
    pthread_create(&thread1, NULL, worker, &id1);
    pthread_create(&thread2, NULL, worker, &id2);
    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);
    printf("Expected Counter: %d | Actual Counter: %ld\\n", ITERATIONS * 2, shared_counter);
}`
};

// Quiz Questions Bank
const quizQuestions = [
  {
    q: "1. What does the POSIX fork() system call return to the newly created child process?",
    options: [
      "The child's own PID",
      "The parent's PID",
      "0 (Zero)",
      "-1 on failure"
    ],
    answer: 2,
    explanation: "fork() returns 0 to the child process and the child's positive PID to the parent process, allowing each branch to determine its role."
  },
  {
    q: "2. Which POSIX function replaces the current process memory image with a new executable program?",
    options: [
      "fork()",
      "exec() family (e.g. execlp)",
      "waitpid()",
      "sigaction()"
    ],
    answer: 1,
    explanation: "The exec() family (such as execlp) replaces the entire text, data, heap, and stack segments with the specified binary."
  },
  {
    q: "3. When creating a pipe with pipe(pipefd), which file descriptor is reserved for reading?",
    options: [
      "pipefd[0]",
      "pipefd[1]",
      "pipefd[2]",
      "stdin (0)"
    ],
    answer: 0,
    explanation: "In POSIX pipes, pipefd[0] is the read end of the pipe, and pipefd[1] is the write end."
  },
  {
    q: "4. What happens when two threads update a shared variable without pthread_mutex_lock()?",
    options: [
      "The program terminates with SIGSEGV immediately",
      "A Race Condition occurs, causing lost updates and corrupted counter values",
      "Linux kernel automatically serializes the updates",
      "Memory leak occurs in the heap"
    ],
    answer: 1,
    explanation: "Without mutual exclusion locks, concurrent thread instructions interleave at the CPU assembly level (read-modify-write), causing race conditions and lost increments."
  },
  {
    q: "5. In the Linux Virtual Memory layout on x86_64, which segment grows downward towards lower addresses?",
    options: [
      "Heap",
      "Text segment",
      "Stack segment",
      "BSS segment"
    ],
    answer: 2,
    explanation: "The Stack segment starts at high virtual memory addresses and grows downward as function frames are pushed."
  }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initThemeToggle();
  initTerminal();
  initQuiz();
  loadCodeFile('main.c');
  setupMutexToggle();
});

// Navigation Handling
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  const openTerminalBtn = document.getElementById('open-terminal-btn');
  if (openTerminalBtn) {
    openTerminalBtn.addEventListener('click', () => switchTab('terminal'));
  }
}

function switchTab(tabId) {
  state.activeTab = tabId;

  // Update Nav Links
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update Panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.style.display = 'none';
  });

  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) {
    activePane.style.display = 'block';
    activePane.classList.remove('fade-in');
    void activePane.offsetWidth; // Trigger reflow
    activePane.classList.add('fade-in');
  }

  if (tabId === 'terminal') {
    const input = document.getElementById('terminal-input');
    if (input) input.focus();
  }
}

// Theme Toggle
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');

  btn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    state.theme = newTheme;

    if (newTheme === 'light') {
      icon.textContent = '🌙';
      text.textContent = 'Dark';
    } else {
      icon.textContent = '☀️';
      text.textContent = 'Light';
    }
  });
}

// ============================================================================
// TERMINAL REPL & EMULATOR
// ============================================================================
function initTerminal() {
  const input = document.getElementById('terminal-input');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (state.historyIndex > 0) {
        state.historyIndex--;
        input.value = state.commandHistory[state.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (state.historyIndex < state.commandHistory.length - 1) {
        state.historyIndex++;
        input.value = state.commandHistory[state.historyIndex];
      } else {
        state.historyIndex = state.commandHistory.length;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      autoCompleteCommand(input);
    }
  });
}

function handleTerminalSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('terminal-input');
  const cmd = input.value.trim();
  if (!cmd) return;

  state.commandHistory.push(cmd);
  state.historyIndex = state.commandHistory.length;
  input.value = '';

  executeTerminalCommand(cmd);
}

function runCommand(cmd) {
  const terminalTab = document.getElementById('tab-terminal');
  if (terminalTab && terminalTab.style.display === 'none') {
    switchTab('terminal');
  }
  executeTerminalCommand(cmd);
}

function insertCommand(cmd) {
  const input = document.getElementById('terminal-input');
  if (input) {
    input.value = cmd;
    input.focus();
  }
}

function clearTerminal() {
  const output = document.getElementById('terminal-output');
  output.innerHTML = `UnixSuite > <span style="color: var(--accent-cyan); animation: pulse 1s infinite;">_</span>`;
}

function executeTerminalCommand(cmd) {
  const output = document.getElementById('terminal-output');
  // Remove cursor
  const cleanHTML = output.innerHTML.replace(/<span style="color: var\(--accent-cyan\); animation: pulse 1s infinite;">_<\/span>/g, '');
  
  let response = '';

  const parts = cmd.split(' ');
  const baseCmd = parts[0];
  const arg = parts.slice(1).join(' ');

  switch (baseCmd) {
    case 'help':
      response = `
--------------- AVAILABLE COMMANDS ---------------

SYSTEM INFORMATION
  system-info
      Display operating system, CPU and memory information.

PROCESS MANAGEMENT
  processes
      Demonstrate process creation and execution.

FILE SYSTEM
  file-info <filename>
      Display file information and explain file descriptors.
  read-file <filename>
      Read and display the contents of a file.
  create-file <filename>
      Create a new file using the open() system call.

IPC UTILITIES
  ipc-demo
      Demonstrate inter-process communication using pipe().
  signal-demo
      Demonstrate signal handling using sigaction() and kill().

MEMORY ANALYSIS
  memory-info
      Display process memory information from /proc.
  memory-maps
      Display virtual memory mappings from /proc/self/maps.

CONCURRENCY
  thread-demo
      Demonstrate threads and mutex synchronization.

GENERAL
  help
      Display this help menu.
  clear
      Clear the terminal screen.
  exit
      Exit UnixSuite.
---------------------------------------------------`;
      break;

    case 'system-info':
      response = `
===============================================
             SYSTEM INFORMATION               
===============================================

[INTERNAL WORKING]
UnixSuite is communicating with Linux through
POSIX/Linux system interfaces.

[1] Operating System Information
-----------------------------------------------
System      : Linux
Node Name   : unixsuite-workstation
Kernel      : 6.6.137-microsoft-standard-WSL2
Version     : #1 SMP PREEMPT_DYNAMIC GNU/Linux
Architecture: x86_64

[INTERNAL]
uname() was used to obtain kernel information.

[2] CPU Information
-----------------------------------------------
Available CPU Cores : 16

[INTERNAL]
sysconf(_SC_NPROCESSORS_ONLN) was used to
obtain the number of online processors.

[3] Memory Information
-----------------------------------------------
Page Size         : 4096 bytes
Physical Pages    : 4194304
Approx. Total RAM : 16.00 GB

[INTERNAL]
sysconf() was used to obtain Linux system
configuration values such as page size and
physical memory pages.

===============================================`;
      break;

    case 'processes':
      response = `
===============================================
              PROCESS MANAGER                 
===============================================

[INTERNAL WORKING]
This demonstration shows how Linux creates
and manages processes.

STEP 1: fork()
-----------------------------------------------
fork() creates a new child process.

[CHILD PROCESS]
Child PID  : 4013
Parent PID : 4012

[INTERNAL]
fork() successfully created this child.

STEP 2: exec()
-----------------------------------------------
The child will execute the 'echo' program.
exec() replaces the current child program image.
[Child] exec() successfully executed a new program!

[PARENT PROCESS]
Parent PID : 4012
Child PID  : 4013

[INTERNAL]
Parent continues after fork().
Parent now calls wait() for the child.

STEP 3: wait()
-----------------------------------------------
[Parent] Child completed normally.
[Parent] Child exit status: 0

PROCESS FLOW
-----------------------------------------------
Parent
  |
  | fork()
  +------> Child
             |
             | exec()
             v
          New Program
             |
             v
          exit()
             |
  <----------+
       wait()

===============================================`;
      break;

    case 'file-info':
      if (!arg) {
        response = `\n[ERROR] Please provide a filename.\nUsage: file-info <filename>`;
      } else if (state.virtualFiles[arg]) {
        const f = state.virtualFiles[arg];
        response = `
===============================================
                FILE INFORMATION              
===============================================

[INTERNAL WORKING]
stat() asks Linux for metadata about the file.

File: ${arg}

FILE ATTRIBUTES
-----------------------------------------------
Size       : ${f.size} bytes
Permissions: ${f.mode}
Owner UID  : ${f.uid}
Group GID  : ${f.gid}
Links      : ${f.nlink}

[INTERNAL]
stat() obtains file metadata from the Linux
file system.

===============================================`;
      } else {
        response = `\n[ERROR] stat(): No such file or directory: ${arg}`;
      }
      break;

    case 'read-file':
      if (!arg) {
        response = `\n[ERROR] Please provide a filename.\nUsage: read-file <filename>`;
      } else if (state.virtualFiles[arg]) {
        const f = state.virtualFiles[arg];
        response = `
===============================================
                  READ FILE                    
===============================================

[INTERNAL WORKING]
1. open() requests access to the file.
2. Linux returns a file descriptor.
3. read() obtains bytes from the file.
4. close() releases the file descriptor.

[INTERNAL]
File opened successfully.
File Descriptor (fd): 3

FILE CONTENT
-----------------------------------------------
${f.content}

[INTERNAL]
close(3) released the file descriptor.

===============================================`;
      } else {
        response = `\n[ERROR] open(): No such file or directory: ${arg}`;
      }
      break;

    case 'create-file':
      if (!arg) {
        response = `\n[ERROR] Please provide a filename.\nUsage: create-file <filename>`;
      } else if (state.virtualFiles[arg]) {
        response = `\n[ERROR] File already exists: ${arg}`;
      } else {
        state.virtualFiles[arg] = {
          size: 64,
          mode: '0644',
          uid: 1000,
          gid: 1000,
          nlink: 1,
          content: `Initialized new Unix file [${arg}] at ${new Date().toLocaleTimeString()}`
        };
        updateFilePills();
        response = `
===============================================
                  CREATE FILE                 
===============================================

[INTERNAL WORKING]
open() requests Linux to create a new file.
O_CREAT creates the file if it does not exist.

[SUCCESS]
File created: ${arg}
File Descriptor: 4

[INTERNAL]
open() returned file descriptor 4.
The file descriptor represents the open file
inside the process.
close() released the file descriptor.

===============================================`;
      }
      break;

    case 'ipc-demo':
      response = `
===============================================
                 IPC DEMO                     
===============================================

[INTERNAL WORKING]
pipe() creates a communication channel between processes.
fork() creates a child process that inherits the pipe.
The child writes data and the parent reads it.

[1] pipe()
-----------------------------------------------
Read FD  : 3
Write FD : 4

[CHILD]
Child PID : 4013
[INTERNAL] Child writes data into the pipe.

[PARENT]
Parent PID : 4012
[INTERNAL] Parent reads data from the pipe.

[RESULT]
Message received: Hello from child process through pipe!
Bytes received  : 39

[INTERNAL]
close() released the pipe file descriptors.
waitpid() confirmed that the child completed.

IPC FLOW
-----------------------------------------------
Parent
  |
  | pipe()
  | fork()
  +------> Child
             |
             | write()
             v
            PIPE
             |
             | read()
             v
           Parent

===============================================`;
      break;

    case 'signal-demo':
      response = `
===============================================
               SIGNAL DEMO                    
===============================================

[INTERNAL WORKING]
A signal is a notification sent to a process.
sigaction() installs a handler for a signal.
kill() sends the signal to the selected process.

[1] Signal handler installed
-----------------------------------------------
Process PID : 4012
Signal      : SIGUSR1

[2] Sending signal
-----------------------------------------------
[RESULT] SIGUSR1 was received successfully.

[INTERNAL]
The signal handler ran when the process received SIGUSR1.

===============================================`;
      break;

    case 'memory-info':
      response = `
===============================================
                MEMORY ANALYSIS               
===============================================

[INTERNAL WORKING]
Linux exposes process memory information through /proc.
UnixSuite reads /proc/self/status for this process.

MEMORY INFORMATION
-----------------------------------------------
VmPeak:     4820 kB
VmSize:     4712 kB
VmRSS:      1840 kB
VmData:      348 kB
VmStk:       132 kB

SYSTEM MEMORY PAGE
-----------------------------------------------
Page Size : 4096 bytes

[INTERNAL]
fopen()/fgets() read process memory statistics from /proc.
sysconf(_SC_PAGESIZE) obtained the system page size.

===============================================`;
      break;

    case 'memory-maps':
      response = `
===============================================
                 MEMORY MAPS                  
===============================================

[INTERNAL WORKING]
/proc/self/maps contains the virtual memory regions
currently mapped into the UnixSuite process.

VIRTUAL MEMORY REGIONS
-----------------------------------------------
55e8178a2000-55e8178a5000 r--p 00000000 08:02 1442142  /usr/local/bin/unixsuite
55e8178a5000-55e8178ab000 r-xp 00003000 08:02 1442142  /usr/local/bin/unixsuite
55e8178ab000-55e8178ad000 r--p 00009000 08:02 1442142  /usr/local/bin/unixsuite
55e8178ad000-55e8178ae000 rw-p 0000b000 08:02 1442142  /usr/local/bin/unixsuite
55e819b88000-55e819ba9000 rw-p 00000000 00:00 0        [heap]
7f209f800000-7f209f828000 r--p 00000000 08:02 2110294  /usr/lib/x86_64-linux-gnu/libc.so.6
7f209f828000-7f209f9bd000 r-xp 00028000 08:02 2110294  /usr/lib/x86_64-linux-gnu/libc.so.6
7f209f9bd000-7f209fa15000 r--p 001bd000 08:02 2110294  /usr/lib/x86_64-linux-gnu/libc.so.6
7f209fa15000-7f209fa19000 rw-p 00215000 08:02 2110294  /usr/lib/x86_64-linux-gnu/libc.so.6
7ffdb51e3000-7ffdb5204000 rw-p 00000000 00:00 0        [stack]

[INTERNAL]
Each line represents a virtual memory mapping.
Only the first 10 mappings are displayed for readability.

===============================================`;
      break;

    case 'thread-demo':
      response = `
===============================================
          CONCURRENCY & SYNCHRONIZATION       
===============================================

[INTERNAL WORKING]
pthread_create() creates threads inside one process.
Both threads access the same shared counter.
A mutex protects the counter from simultaneous updates.

[1] Creating threads
-----------------------------------------------
Thread 1 created successfully.
Thread 2 created successfully.
[Thread 1] Completed 100000 increments.
[Thread 2] Completed 100000 increments.

[2] Thread synchronization
-----------------------------------------------
Mutex: pthread_mutex_lock() / unlock()
Each thread increments the shared counter safely.

[RESULT]
-----------------------------------------------
Expected Counter : 200000
Actual Counter   : 200000

[INTERNAL]
pthread_join() waits for both threads to finish.
The mutex prevents concurrent updates from corrupting the counter.

THREAD FLOW
-----------------------------------------------
              Main Process
                    |
          pthread_create()
             /          \\
            v            v
        Thread 1      Thread 2
            \\            /
             \\  Mutex   /
              \\   |    /
               \\  |   /
                Shared Counter
                    |
              pthread_join()

===============================================`;
      break;

    case 'clear':
      clearTerminal();
      return;

    case 'exit':
      response = `
[UnixSuite] Shutting down...
[INTERNAL] Main command loop is terminating.
Goodbye!`;
      break;

    default:
      response = `
[ERROR] Unknown command: ${cmd}
[TIP] Type 'help' to see available commands.`;
      break;
  }

  output.innerHTML = cleanHTML + `\nUnixSuite > ${cmd}\n` + response + `\n\nUnixSuite > <span style="color: var(--accent-cyan); animation: pulse 1s infinite;">_</span>`;
  output.scrollTop = output.scrollHeight;
}

function autoCompleteCommand(input) {
  const val = input.value.trim();
  const candidates = [
    'system-info', 'processes', 'file-info test.txt', 'read-file test.txt',
    'create-file ', 'ipc-demo', 'signal-demo', 'memory-info', 'memory-maps',
    'thread-demo', 'help', 'clear', 'exit'
  ];
  const match = candidates.find(c => c.startsWith(val));
  if (match) {
    input.value = match;
  }
}

// ============================================================================
// SYSTEM INFO & TELEMETRY
// ============================================================================
function refreshSysInfo() {
  const sysNode = document.getElementById('sys-node');
  const calcRam = document.getElementById('calc-ram-val');
  if (sysNode) {
    sysNode.textContent = 'unixsuite-node-' + Math.floor(Math.random() * 9000 + 1000);
  }
  if (calcRam) {
    calcRam.textContent = '16.00 GB (Active)';
  }
}

// ============================================================================
// PROCESS LIFECYCLE SIMULATOR
// ============================================================================
function simulateProcessFlow() {
  const steps = [
    document.getElementById('step-1-box'),
    document.getElementById('step-2-box'),
    document.getElementById('step-3-box')
  ];
  const statusPill = document.getElementById('sim-status-pill');
  const childBox = document.getElementById('child-node-box');
  const childState = document.getElementById('child-state-badge');
  const parentState = document.getElementById('parent-state-badge');

  // Step 1: Fork
  steps.forEach(s => s.classList.remove('active-step'));
  steps[0].classList.add('active-step');
  statusPill.textContent = 'Step 1: fork() called';
  statusPill.style.color = 'var(--accent-cyan)';
  childBox.style.opacity = '1';
  childBox.style.borderStyle = 'solid';
  childState.textContent = 'STATE: READY / FORKED';
  childState.style.color = '#38bdf8';
  parentState.textContent = 'STATE: RUNNING';

  setTimeout(() => {
    // Step 2: Exec
    steps[0].classList.remove('active-step');
    steps[1].classList.add('active-step');
    statusPill.textContent = 'Step 2: execlp("echo")';
    statusPill.style.color = 'var(--accent-purple)';
    childState.textContent = 'STATE: RUNNING (echo)';
    childState.style.color = '#a855f7';
    parentState.textContent = 'STATE: BLOCKED in waitpid()';
    parentState.style.color = '#f59e0b';
  }, 1400);

  setTimeout(() => {
    // Step 3: Wait & Exit
    steps[1].classList.remove('active-step');
    steps[2].classList.add('active-step');
    statusPill.textContent = 'Step 3: waitpid() Complete';
    statusPill.style.color = 'var(--accent-emerald)';
    childState.textContent = 'STATE: ZOMBIE -> REAPED (Exit 0)';
    childState.style.color = '#10b981';
    parentState.textContent = 'STATE: RESUMED / RUNNING';
    parentState.style.color = '#34d399';
  }, 2800);
}

function resetProcessFlow() {
  const steps = [
    document.getElementById('step-1-box'),
    document.getElementById('step-2-box'),
    document.getElementById('step-3-box')
  ];
  steps.forEach(s => s.classList.remove('active-step'));
  document.getElementById('sim-status-pill').textContent = 'Ready to Fork';
  document.getElementById('child-node-box').style.opacity = '0.5';
  document.getElementById('child-node-box').style.borderStyle = 'dashed';
  document.getElementById('child-state-badge').textContent = 'STATE: UNSPAWNED';
  document.getElementById('child-state-badge').style.color = '#f59e0b';
  document.getElementById('parent-state-badge').textContent = 'STATE: RUNNING / WAIT';
}

// ============================================================================
// VIRTUAL FILE SYSTEM & INODE INSPECTION
// ============================================================================
function inspectFile(filename) {
  const file = state.virtualFiles[filename];
  if (!file) return;

  document.getElementById('inspect-filename').textContent = filename;
  document.getElementById('stat-size').textContent = `${file.size} B`;
  document.getElementById('stat-mode').textContent = file.mode;
  document.getElementById('stat-uid').textContent = `${file.uid} : ${file.gid}`;
  document.getElementById('stat-links').textContent = file.nlink;
}

function updateFilePills() {
  const container = document.getElementById('file-pills-container');
  if (!container) return;
  container.innerHTML = '';
  Object.keys(state.virtualFiles).forEach(fname => {
    const f = state.virtualFiles[fname];
    const btn = document.createElement('button');
    btn.className = 'cmd-pill';
    btn.textContent = `${fname} (${f.size} B)`;
    btn.onclick = () => inspectFile(fname);
    container.appendChild(btn);
  });
}

function createNewVirtualFile() {
  const name = prompt('Enter new filename (e.g. system_test.dat):', `custom_${Math.floor(Math.random() * 900 + 100)}.txt`);
  if (!name) return;
  if (state.virtualFiles[name]) {
    alert('File already exists!');
    return;
  }
  state.virtualFiles[name] = {
    size: 256,
    mode: '0644',
    uid: 1000,
    gid: 1000,
    nlink: 1,
    content: `Virtual POSIX file created in UnixSuite.\nCreated: ${new Date().toISOString()}`
  };
  updateFilePills();
  inspectFile(name);

  // Update FD table
  const tbody = document.getElementById('fd-table-body');
  const tr = document.createElement('tr');
  const fdNum = tbody.children.length;
  tr.innerHTML = `
    <td><span class="fd-badge fd-user">${fdNum}</span></td>
    <td>${name} (User File)</td>
    <td>O_RDWR | O_CREAT</td>
    <td style="color: var(--accent-emerald);">OPEN</td>
  `;
  tbody.appendChild(tr);
}

// ============================================================================
// IPC & SIGNAL FLOW
// ============================================================================
function simulatePipeTransmission() {
  const display = document.getElementById('pipe-packet-display');
  display.textContent = '>>> [DATA PACKET: 39 Bytes] >>>';
  display.style.background = 'rgba(0, 240, 255, 0.3)';
  display.style.borderColor = 'var(--accent-cyan)';
  display.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.5)';

  setTimeout(() => {
    display.textContent = 'Kernel Buffer (64 KB) — Message Delivered';
    display.style.background = 'rgba(16, 185, 129, 0.2)';
    display.style.borderColor = 'var(--accent-emerald)';
    display.style.boxShadow = 'none';
  }, 1200);
}

function sendDemoSignal(sig) {
  const stateLabel = document.getElementById('sig-handler-state');
  const lastReceived = document.getElementById('sig-last-received');

  lastReceived.textContent = `Last Received: ${sig} at ${new Date().toLocaleTimeString()}`;
  lastReceived.style.color = 'var(--accent-cyan)';

  if (sig === 'SIGUSR1') {
    stateLabel.textContent = 'Handler Invoked: handle_sigusr1() (Flag = 1)';
    stateLabel.style.color = 'var(--accent-emerald)';
  } else if (sig === 'SIGINT') {
    stateLabel.textContent = 'SIGINT Handled: Process Interrupted';
    stateLabel.style.color = 'var(--accent-amber)';
  } else {
    stateLabel.textContent = `Signal ${sig} Delivered to PID 4012`;
    stateLabel.style.color = 'var(--accent-purple)';
  }
}

// ============================================================================
// MEMORY STATS
// ============================================================================
function refreshMemoryStats() {
  const vmPeak = document.getElementById('mem-vmpeak');
  const vmSize = document.getElementById('mem-vmsize');
  const vmRss = document.getElementById('mem-vmrss');

  const randomDelta = Math.floor(Math.random() * 80) - 40;
  if (vmSize) vmSize.textContent = `${4712 + randomDelta} kB`;
  if (vmRss) vmRss.textContent = `${1840 + Math.floor(randomDelta / 2)} kB`;
}

// ============================================================================
// CONCURRENCY & MUTEX SIMULATOR
// ============================================================================
function setupMutexToggle() {
  const toggle = document.getElementById('mutex-toggle');
  const label = document.getElementById('mutex-state-label');

  if (toggle && label) {
    toggle.addEventListener('change', () => {
      state.mutexEnabled = toggle.checked;
      if (toggle.checked) {
        label.textContent = 'Mutex Protection: ENABLED';
        label.style.color = 'var(--text-main)';
      } else {
        label.textContent = 'Mutex Protection: DISABLED (Race Condition Danger)';
        label.style.color = 'var(--accent-rose)';
      }
    });
  }
}

function startConcurrencySimulation() {
  if (state.isRaceRunning) return;
  state.isRaceRunning = true;

  const btn = document.getElementById('start-race-btn');
  btn.disabled = true;
  btn.style.opacity = '0.5';

  const t1Progress = document.getElementById('t1-progress');
  const t2Progress = document.getElementById('t2-progress');
  const t1Count = document.getElementById('t1-count');
  const t2Count = document.getElementById('t2-count');
  const t1Status = document.getElementById('t1-status');
  const t2Status = document.getElementById('t2-status');
  const actualVal = document.getElementById('actual-counter-val');
  const diffSub = document.getElementById('counter-diff-sub');
  const outcomeVal = document.getElementById('race-outcome-val');
  const outcomeSub = document.getElementById('race-outcome-sub');

  t1Status.textContent = 'Running';
  t2Status.textContent = 'Running';
  t1Status.style.color = 'var(--accent-cyan)';
  t2Status.style.color = 'var(--accent-purple)';
  outcomeVal.textContent = 'Executing Threads...';
  outcomeVal.style.color = 'var(--accent-amber)';

  let p1 = 0;
  let p2 = 0;
  const target = 100000;
  const withMutex = state.mutexEnabled;

  const interval = setInterval(() => {
    p1 += Math.floor(Math.random() * 4000) + 2000;
    p2 += Math.floor(Math.random() * 4000) + 2000;

    if (p1 > target) p1 = target;
    if (p2 > target) p2 = target;

    const pct1 = (p1 / target) * 100;
    const pct2 = (p2 / target) * 100;

    t1Progress.style.width = `${pct1}%`;
    t2Progress.style.width = `${pct2}%`;
    t1Count.textContent = p1.toLocaleString();
    t2Count.textContent = p2.toLocaleString();

    let currentShared = withMutex
      ? (p1 + p2)
      : Math.floor((p1 + p2) * (0.65 + (Math.sin(p1) * 0.1)));

    actualVal.textContent = currentShared.toLocaleString();

    if (p1 >= target && p2 >= target) {
      clearInterval(interval);
      state.isRaceRunning = false;
      btn.disabled = false;
      btn.style.opacity = '1';
      t1Status.textContent = 'Finished (Joined)';
      t2Status.textContent = 'Finished (Joined)';

      if (withMutex) {
        const finalCount = 200000;
        actualVal.textContent = finalCount.toLocaleString();
        actualVal.style.color = 'var(--accent-emerald)';
        diffSub.textContent = 'Delta: 0 (100% Accurate & Synchronized)';
        diffSub.style.color = 'var(--accent-emerald)';
        outcomeVal.textContent = '✅ MUTEX SAFE';
        outcomeVal.style.color = 'var(--accent-emerald)';
        outcomeSub.textContent = 'Critical section protected. Zero lost updates!';
      } else {
        // Lost updates occurred due to lack of mutex
        const lost = Math.floor(Math.random() * 45000) + 35000;
        const finalCount = 200000 - lost;
        actualVal.textContent = finalCount.toLocaleString();
        actualVal.style.color = 'var(--accent-rose)';
        diffSub.textContent = `Delta: -${lost.toLocaleString()} LOST UPDATES`;
        diffSub.style.color = 'var(--accent-rose)';
        outcomeVal.textContent = '⚠️ RACE CONDITION DETECTED';
        outcomeVal.style.color = 'var(--accent-rose)';
        outcomeSub.textContent = 'Concurrent threads corrupted shared memory!';
      }
    }
  }, 40);
}

// ============================================================================
// POSIX QUIZ MODULE
// ============================================================================
function initQuiz() {
  state.quizCurrentIndex = 0;
  state.quizScore = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  if (state.quizCurrentIndex >= quizQuestions.length) {
    // Show Final Results
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
        <h3 style="font-size: 1.4rem; color: var(--text-main); margin-bottom: 0.5rem;">Quiz Completed!</h3>
        <p style="font-size: 1rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          You scored <strong style="color: var(--accent-cyan);">${state.quizScore}</strong> out of <strong>${quizQuestions.length}</strong>!
        </p>
        <button class="btn-primary" style="margin: 0 auto;" onclick="initQuiz()">Restart Quiz</button>
      </div>
    `;
    return;
  }

  const item = quizQuestions[state.quizCurrentIndex];
  const badge = document.getElementById('quiz-score-badge');
  if (badge) {
    badge.textContent = `Question ${state.quizCurrentIndex + 1} / ${quizQuestions.length} | Score: ${state.quizScore}`;
  }

  container.innerHTML = `
    <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-main); margin-bottom: 1rem;">
      ${item.q}
    </div>
    <div style="display: flex; flex-direction: column; gap: 0.75rem;" id="quiz-options-list">
      ${item.options.map((opt, i) => `
        <div class="quiz-option" onclick="handleQuizAnswer(${i})">
          <span style="font-weight: 700; color: var(--accent-cyan); width: 24px;">${String.fromCharCode(65 + i)}.</span>
          <span>${opt}</span>
        </div>
      `).join('')}
    </div>
    <div id="quiz-feedback-box" style="display: none; margin-top: 1rem;"></div>
  `;
}

function handleQuizAnswer(selectedIndex) {
  const item = quizQuestions[state.quizCurrentIndex];
  const options = document.querySelectorAll('.quiz-option');
  const feedbackBox = document.getElementById('quiz-feedback-box');

  options.forEach(opt => opt.onclick = null); // Disable further clicks

  const isCorrect = (selectedIndex === item.answer);
  if (isCorrect) {
    state.quizScore++;
    options[selectedIndex].classList.add('correct');
  } else {
    options[selectedIndex].classList.add('incorrect');
    options[item.answer].classList.add('correct');
  }

  feedbackBox.style.display = 'block';
  feedbackBox.innerHTML = `
    <div class="edu-callout ${isCorrect ? 'emerald' : 'amber'}">
      <div class="edu-title">${isCorrect ? '✅ Correct Answer!' : '❌ Incorrect'}</div>
      <div class="edu-desc">${item.explanation}</div>
    </div>
    <button class="btn-primary" style="margin-top: 0.75rem;" onclick="nextQuizQuestion()">Next Question ➔</button>
  `;
}

function nextQuizQuestion() {
  state.quizCurrentIndex++;
  renderQuizQuestion();
}

// ============================================================================
// CODE VIEWER
// ============================================================================
function loadCodeFile(filename) {
  const display = document.getElementById('source-code-display');
  const label = document.getElementById('active-file-label');
  if (label) label.textContent = `unixsuite/${filename}`;

  const code = sourceFiles[filename] || '// Source not found';
  if (display) {
    display.textContent = code;
  }
}
