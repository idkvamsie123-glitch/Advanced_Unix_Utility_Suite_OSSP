#define _POSIX_C_SOURCE 200809L
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

    printf("\n===============================================\n");
    printf("              PROCESS MANAGER                 \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("This demonstration shows how Linux creates\n");
    printf("and manages processes.\n");

    printf("\nSTEP 1: fork()\n");
    printf("-----------------------------------------------\n");
    printf("fork() creates a new child process.\n");

    pid = fork();

    if (pid < 0)
    {
        perror("[ERROR] fork()");
        return;
    }

    if (pid == 0)
    {
        printf("\n[CHILD PROCESS]\n");
        printf("Child PID  : %d\n", getpid());
        printf("Parent PID : %d\n", getppid());

        printf("\n[INTERNAL]\n");
        printf("fork() successfully created this child.\n");

        printf("\nSTEP 2: exec()\n");
        printf("-----------------------------------------------\n");
        printf("The child will execute the 'echo' program.\n");
        printf("exec() replaces the current child program image.\n");

        execlp("echo", "echo",
               "[Child] exec() successfully executed a new program!",
               (char *)NULL);

        perror("[ERROR] exec()");
        _exit(1);
    }

    printf("\n[PARENT PROCESS]\n");
    printf("Parent PID : %d\n", getpid());
    printf("Child PID  : %d\n", pid);

    printf("\n[INTERNAL]\n");
    printf("Parent continues after fork().\n");
    printf("Parent now calls wait() for the child.\n");

    printf("\nSTEP 3: wait()\n");
    printf("-----------------------------------------------\n");

    if (waitpid(pid, &status, 0) == -1)
    {
        perror("[ERROR] wait()");
        return;
    }

    if (WIFEXITED(status))
    {
        printf("[Parent] Child completed normally.\n");
        printf("[Parent] Child exit status: %d\n",
               WEXITSTATUS(status));
    }
    else
    {
        printf("[Parent] Child did not exit normally.\n");
    }

    printf("\nPROCESS FLOW\n");
    printf("-----------------------------------------------\n");
    printf("Parent\n");
    printf("  |\n");
    printf("  | fork()\n");
    printf("  +------> Child\n");
    printf("             |\n");
    printf("             | exec()\n");
    printf("             v\n");
    printf("          New Program\n");
    printf("             |\n");
    printf("             v\n");
    printf("          exit()\n");
    printf("             |\n");
    printf("  <----------+\n");
    printf("       wait()\n");

    printf("\n===============================================\n");
}
