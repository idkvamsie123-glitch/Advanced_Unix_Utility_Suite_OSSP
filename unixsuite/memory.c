#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <string.h>
#include <unistd.h>

#include "memory.h"

void memory_info(void)
{
    FILE *file;
    char line[256];

    printf("\n===============================================\n");
    printf("                MEMORY ANALYSIS               \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("Linux exposes process memory information through /proc.\n");
    printf("UnixSuite reads /proc/self/status for this process.\n");

    file = fopen("/proc/self/status", "r");

    if (file == NULL)
    {
        perror("[ERROR] fopen()");
        return;
    }

    printf("\nMEMORY INFORMATION\n");
    printf("-----------------------------------------------\n");

    while (fgets(line, sizeof(line), file) != NULL)
    {
        if (strncmp(line, "VmSize:", 7) == 0 ||
            strncmp(line, "VmRSS:", 6) == 0 ||
            strncmp(line, "VmPeak:", 7) == 0 ||
            strncmp(line, "VmData:", 7) == 0 ||
            strncmp(line, "VmStk:", 6) == 0)
        {
            printf("%s", line);
        }
    }

    fclose(file);

    long page_size = sysconf(_SC_PAGESIZE);

    printf("\nSYSTEM MEMORY PAGE\n");
    printf("-----------------------------------------------\n");
    printf("Page Size : %ld bytes\n", page_size);

    printf("\n[INTERNAL]\n");
    printf("fopen()/fgets() read process memory statistics from /proc.\n");
    printf("sysconf(_SC_PAGESIZE) obtained the system page size.\n");

    printf("\n===============================================\n");
}

void memory_maps(void)
{
    FILE *file;
    char line[512];
    int count = 0;

    printf("\n===============================================\n");
    printf("                 MEMORY MAPS                  \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("/proc/self/maps contains the virtual memory regions\n");
    printf("currently mapped into the UnixSuite process.\n");

    file = fopen("/proc/self/maps", "r");

    if (file == NULL)
    {
        perror("[ERROR] fopen()");
        return;
    }

    printf("\nVIRTUAL MEMORY REGIONS\n");
    printf("-----------------------------------------------\n");

    while (fgets(line, sizeof(line), file) != NULL && count < 12)
    {
        printf("%s", line);
        count++;
    }

    fclose(file);

    printf("\n[INTERNAL]\n");
    printf("Each line represents a virtual memory mapping.\n");
    printf("Only the first 12 mappings are displayed for readability.\n");

    printf("\n===============================================\n");
}
