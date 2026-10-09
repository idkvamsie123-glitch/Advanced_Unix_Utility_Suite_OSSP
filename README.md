# Advanced UNIX Utility Suite (UnixSuite) 🐧
> **A Modular Linux System Programming Toolkit & Interactive Visual Lab in C (POSIX C99)**

[![Language](https://img.shields.io/badge/Language-C99%20%2F%20POSIX-blue.svg)](https://en.wikipedia.org/wiki/C99)
[![Platform](https://img.shields.io/badge/Platform-Linux%20%2F%20UNIX%20%2F%20WSL2-orange.svg)](https://www.kernel.org/)
[![UI](https://img.shields.io/badge/UI-Interactive%20Visual%20Lab-cyan.svg)](index.html)
[![Presentation](https://img.shields.io/badge/Slides-15--Slide%20Presentation-purple.svg)](slides.html)

---

## 👥 Team Members (CSE Department)
* **2610030236** I D K Vamshie
* **2510030261** Kotta Sai Srinath
* **2510030041** V.Keerthana
* **2510030228** K.Akhila

---

## 📌 Project Overview
**UnixSuite** is an educational, modular system programming suite developed in standard **C99** and native **POSIX/Linux interfaces**. It connects theoretical operating system concepts with observable, real-time kernel telemetry (`[INTERNAL WORKING]` logs).

---

## 🏗️ 6 Core Architectural Modules
1. **System Information (`system_info.c`):** Queries kernel release, OS name, CPU cores, and page size via `uname()` and `sysconf()`.
2. **Process Management (`process_manager.c`):** Demonstrates process cloning (`fork()`), binary image overlay (`execlp()`), and parent synchronization (`waitpid()`).
3. **Virtual File System & Inodes (`file_system.c`):** Tracks integer File Descriptors (FDs `0-3+`), stream I/O (`open()`, `read()`, `close()`), and file metadata (`stat()`).
4. **IPC & Signals (`ipc.c`):** Unidirectional kernel pipes (`pipe()`) and asynchronous software interrupts (`sigaction()`, `kill()`).
5. **Memory Analysis (`memory.c`):** Virtual memory segmentation, Resident Set Size (`VmRSS`), and Virtual Memory (`VmSize`) inspection from `/proc/self/status` and `/proc/self/maps`.
6. **Concurrency & Synchronization (`concurrency.c`):** POSIX threads (`pthreads`), critical sections, and race condition prevention using `pthread_mutex_t`.

---

## 🚀 Quick Start (Ubuntu / Linux / WSL)

### 1. Compile and Run the C Terminal Suite
```bash
# Navigate to the source folder
cd unixsuite

# Compile all modules with GCC & Makefile
make clean
make

# Run UnixSuite
./unixsuite
```

### 2. Available Commands in UnixSuite REPL
```bash
system-info          # Display OS, CPU, and page memory information
processes            # Run fork-exec-wait process demo
file-info test.txt   # Inspect inode metadata and permissions via stat()
read-file test.txt   # Read bytes from file via file descriptor
create-file demo.txt # Create new file using open() O_CREAT
ipc-demo             # Test unidirectional pipe transmission
signal-demo          # Dispatch and intercept SIGUSR1
memory-info          # Read process VmSize and VmRSS from /proc
memory-maps          # List virtual memory regions
thread-demo          # Run POSIX threads mutex synchronization
help                 # Display command list
clear                # Clear terminal screen
exit                 # Exit UnixSuite
```

---

## 🌐 Interactive Web UI & 15-Slide Presentation

The project includes an interactive web interface and presentation slide deck:

* **Interactive Visual Lab:** [`index.html`](index.html) — Features a built-in terminal REPL, process lifecycle stepper, virtual memory visualizer, and a live **Mutex Race Condition Simulator**.
* **15-Slide Faculty Presentation Deck:** [`slides.html`](slides.html) — Complete with diagrams, code comparisons, and keyboard navigation (<kbd>◀</kbd> / <kbd>▶</kbd>) + Speaker Notes (<kbd>S</kbd>).

### Run the Web Server Locally:
```bash
# Using Node.js
node server.js

# Or using Python 3
python3 -m http.server 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📂 Project Directory Structure
```
Advanced_Unix_Utility_Suite/
├── unixsuite/                # Core C Backend Implementation
│   ├── main.c                # Interactive CLI REPL loop
│   ├── system_info.c / .h    # uname() & sysconf()
│   ├── process_manager.c / .h# fork(), exec(), waitpid()
│   ├── file_system.c / .h    # open(), read(), stat()
│   ├── ipc.c / .h            # pipe(), sigaction(), kill()
│   ├── memory.c / .h         # /proc/self/status & maps
│   ├── concurrency.c / .h    # pthreads & mutexes
│   ├── Makefile              # GCC build script
│   └── test.txt              # Sample file for VFS demo
├── index.html                # Interactive Web UI Workbench
├── styles.css                # Dark-mode styling
├── app.js                    # Web UI logic & terminal emulator
├── slides.html               # 15-Slide academic presentation
├── server.js                 # Zero-dependency local Node.js server
└── README.md                 # Project documentation
```
