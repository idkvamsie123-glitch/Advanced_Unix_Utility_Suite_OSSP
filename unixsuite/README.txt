ADVANCED UNIX UTILITY SUITE
===========================

Complete combined backend for Review 2.

MODULES
1. System Information
2. Process Management
3. File System
4. IPC Utilities
5. Memory Analysis
6. Concurrency & Synchronization

COMMANDS
system-info
processes
file-info <filename>
read-file <filename>
create-file <filename>
ipc-demo
signal-demo
memory-info
memory-maps
thread-demo
help
clear
exit

BUILD IN WSL
------------
make clean
make
./unixsuite

The program is designed to show INTERNAL WORKING messages so beginners can
connect the command, C implementation, POSIX/Linux API, and OS operation.

NOTE
----
This ZIP contains the complete C backend. The existing graphical frontend
shown in the project screenshot is not included here because its source files
were not part of the backend files used to build the working terminal version.
