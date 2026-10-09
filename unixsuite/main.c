#define _POSIX_C_SOURCE 200809L
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
    printf("\n");
    printf("===============================================\n");
    printf("          ADVANCED UNIX UTILITY SUITE         \n");
    printf("===============================================\n");
    printf(" Integrated Linux System Programming Toolkit\n");
    printf(" Type 'help' to see available commands.\n");
    printf(" Type 'exit' to quit.\n");
    printf("===============================================\n\n");
}

void display_help(void)
{
    printf("\n--------------- AVAILABLE COMMANDS ---------------\n");

    printf("\nSYSTEM INFORMATION\n");
    printf("  system-info\n");
    printf("      Display operating system, CPU and memory information.\n");

    printf("\nPROCESS MANAGEMENT\n");
    printf("  processes\n");
    printf("      Demonstrate process creation and execution.\n");

    printf("\nFILE SYSTEM\n");
    printf("  file-info <filename>\n");
    printf("      Display file information and explain file descriptors.\n");
    printf("  read-file <filename>\n");
    printf("      Read and display the contents of a file.\n");
    printf("  create-file <filename>\n");
    printf("      Create a new file using the open() system call.\n");

    printf("\nIPC UTILITIES\n");
    printf("  ipc-demo\n");
    printf("      Demonstrate inter-process communication using pipe().\n");
    printf("  signal-demo\n");
    printf("      Demonstrate signal handling using sigaction() and kill().\n");

    printf("\nMEMORY ANALYSIS\n");
    printf("  memory-info\n");
    printf("      Display process memory information from /proc.\n");
    printf("  memory-maps\n");
    printf("      Display virtual memory mappings from /proc/self/maps.\n");

    printf("\nCONCURRENCY\n");
    printf("  thread-demo\n");
    printf("      Demonstrate threads and mutex synchronization.\n");

    printf("\nGENERAL\n");
    printf("  help\n");
    printf("      Display this help menu.\n");
    printf("  clear\n");
    printf("      Clear the terminal screen.\n");
    printf("  exit\n");
    printf("      Exit UnixSuite.\n");
    printf("\n---------------------------------------------------\n");
}

void show_unknown_command(const char *command)
{
    printf("\n[ERROR] Unknown command: %s\n", command);
    printf("[TIP] Type 'help' to see available commands.\n");
}

int main(void)
{
    char input[MAX_INPUT];

    display_banner();

    while (1)
    {
        printf("UnixSuite > ");

        if (fgets(input, sizeof(input), stdin) == NULL)
        {
            printf("\nExiting UnixSuite...\n");
            break;
        }

        input[strcspn(input, "\n")] = '\0';

        if (strlen(input) == 0)
            continue;

        if (strcmp(input, "exit") == 0)
        {
            printf("\n[UnixSuite] Shutting down...\n");
            printf("[INTERNAL] Main command loop is terminating.\n");
            printf("Goodbye!\n\n");
            break;
        }
        else if (strcmp(input, "help") == 0)
        {
            display_help();
        }
        else if (strcmp(input, "clear") == 0)
        {
            system("clear");
        }
        else if (strcmp(input, "system-info") == 0)
        {
            display_system_info();
        }
        else if (strcmp(input, "processes") == 0)
        {
            process_demo();
        }
        else if (strncmp(input, "file-info ", 10) == 0)
        {
            char *filename = input + 10;
            if (strlen(filename) == 0)
                printf("[ERROR] Please provide a filename.\n");
            else
                file_info(filename);
        }
        else if (strncmp(input, "read-file ", 10) == 0)
        {
            char *filename = input + 10;
            if (strlen(filename) == 0)
                printf("[ERROR] Please provide a filename.\n");
            else
                read_file(filename);
        }
        else if (strncmp(input, "create-file ", 12) == 0)
        {
            char *filename = input + 12;
            if (strlen(filename) == 0)
                printf("[ERROR] Please provide a filename.\n");
            else
                create_file(filename);
        }
        else if (strcmp(input, "ipc-demo") == 0)
        {
            ipc_demo();
        }
        else if (strcmp(input, "signal-demo") == 0)
        {
            signal_demo();
        }
        else if (strcmp(input, "memory-info") == 0)
        {
            memory_info();
        }
        else if (strcmp(input, "memory-maps") == 0)
        {
            memory_maps();
        }
        else if (strcmp(input, "thread-demo") == 0)
        {
            thread_demo();
        }
        else
        {
            show_unknown_command(input);
        }
    }

    return 0;
}
