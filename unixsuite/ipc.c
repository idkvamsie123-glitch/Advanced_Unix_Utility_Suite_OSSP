#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <signal.h>
#include <string.h>

#include "ipc.h"

static volatile sig_atomic_t signal_received = 0;

static void handle_sigusr1(int sig)
{
    (void)sig;
    signal_received = 1;
}

void ipc_demo(void)
{
    int pipefd[2];
    pid_t pid;
    char buffer[128];

    printf("\n===============================================\n");
    printf("                 IPC DEMO                     \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("pipe() creates a communication channel between processes.\n");
    printf("fork() creates a child process that inherits the pipe.\n");
    printf("The child writes data and the parent reads it.\n");

    if (pipe(pipefd) == -1)
    {
        perror("[ERROR] pipe()");
        return;
    }

    printf("\n[1] pipe()\n");
    printf("-----------------------------------------------\n");
    printf("Read FD  : %d\n", pipefd[0]);
    printf("Write FD : %d\n", pipefd[1]);

    pid = fork();

    if (pid < 0)
    {
        perror("[ERROR] fork()");
        close(pipefd[0]);
        close(pipefd[1]);
        return;
    }

    if (pid == 0)
    {
        const char *message = "Hello from child process through pipe!";

        close(pipefd[0]);

        printf("\n[CHILD]\n");
        printf("Child PID : %d\n", getpid());
        printf("[INTERNAL] Child writes data into the pipe.\n");

        if (write(pipefd[1], message, strlen(message) + 1) == -1)
            perror("[ERROR] write()");

        close(pipefd[1]);
        _exit(0);
    }

    close(pipefd[1]);

    printf("\n[PARENT]\n");
    printf("Parent PID : %d\n", getpid());
    printf("[INTERNAL] Parent reads data from the pipe.\n");

    ssize_t bytes = read(pipefd[0], buffer, sizeof(buffer) - 1);

    if (bytes < 0)
    {
        perror("[ERROR] read()");
    }
    else
    {
        buffer[bytes] = '\0';
        printf("\n[RESULT]\n");
        printf("Message received: %s\n", buffer);
        printf("Bytes received  : %zd\n", bytes);
    }

    close(pipefd[0]);
    waitpid(pid, NULL, 0);

    printf("\n[INTERNAL]\n");
    printf("close() released the pipe file descriptors.\n");
    printf("waitpid() confirmed that the child completed.\n");

    printf("\nIPC FLOW\n");
    printf("-----------------------------------------------\n");
    printf("Parent\n");
    printf("  |\n");
    printf("  | pipe()\n");
    printf("  | fork()\n");
    printf("  +------> Child\n");
    printf("             |\n");
    printf("             | write()\n");
    printf("             v\n");
    printf("            PIPE\n");
    printf("             |\n");
    printf("             | read()\n");
    printf("             v\n");
    printf("           Parent\n");

    printf("\n===============================================\n");
}

void signal_demo(void)
{
    struct sigaction sa;
    pid_t pid;

    printf("\n===============================================\n");
    printf("               SIGNAL DEMO                    \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("A signal is a notification sent to a process.\n");
    printf("sigaction() installs a handler for a signal.\n");
    printf("kill() sends the signal to the selected process.\n");

    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = handle_sigusr1;
    sigemptyset(&sa.sa_mask);

    if (sigaction(SIGUSR1, &sa, NULL) == -1)
    {
        perror("[ERROR] sigaction()");
        return;
    }

    pid = getpid();

    printf("\n[1] Signal handler installed\n");
    printf("-----------------------------------------------\n");
    printf("Process PID : %d\n", pid);
    printf("Signal      : SIGUSR1\n");

    printf("\n[2] Sending signal\n");
    printf("-----------------------------------------------\n");

    if (kill(pid, SIGUSR1) == -1)
    {
        perror("[ERROR] kill()");
        return;
    }

    if (signal_received)
        printf("[RESULT] SIGUSR1 was received successfully.\n");

    printf("\n[INTERNAL]\n");
    printf("The signal handler ran when the process received SIGUSR1.\n");

    printf("\n===============================================\n");
}
