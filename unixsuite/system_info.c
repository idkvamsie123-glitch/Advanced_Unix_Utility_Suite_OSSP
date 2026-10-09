#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <unistd.h>
#include <sys/utsname.h>

#include "system_info.h"

void display_system_info(void)
{
    struct utsname info;
    long cores;
    long page_size;
    long physical_pages;

    printf("\n===============================================\n");
    printf("             SYSTEM INFORMATION               \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("UnixSuite is communicating with Linux through\n");
    printf("POSIX/Linux system interfaces.\n");

    if (uname(&info) == -1)
    {
        perror("uname");
        return;
    }

    printf("\n[1] Operating System Information\n");
    printf("-----------------------------------------------\n");
    printf("System      : %s\n", info.sysname);
    printf("Node Name   : %s\n", info.nodename);
    printf("Kernel      : %s\n", info.release);
    printf("Version     : %s\n", info.version);
    printf("Architecture: %s\n", info.machine);

    printf("\n[INTERNAL]\n");
    printf("uname() was used to obtain kernel information.\n");

    cores = sysconf(_SC_NPROCESSORS_ONLN);

    printf("\n[2] CPU Information\n");
    printf("-----------------------------------------------\n");
    printf("Available CPU Cores : %ld\n", cores);

    printf("\n[INTERNAL]\n");
    printf("sysconf(_SC_NPROCESSORS_ONLN) was used to\n");
    printf("obtain the number of online processors.\n");

    page_size = sysconf(_SC_PAGESIZE);
    physical_pages = sysconf(_SC_PHYS_PAGES);

    printf("\n[3] Memory Information\n");
    printf("-----------------------------------------------\n");
    printf("Page Size         : %ld bytes\n", page_size);
    printf("Physical Pages    : %ld\n", physical_pages);

    if (page_size > 0 && physical_pages > 0)
    {
        double total_gb =
            ((double)page_size * (double)physical_pages) /
            (1024.0 * 1024.0 * 1024.0);

        printf("Approx. Total RAM : %.2f GB\n", total_gb);
    }

    printf("\n[INTERNAL]\n");
    printf("sysconf() was used to obtain Linux system\n");
    printf("configuration values such as page size and\n");
    printf("physical memory pages.\n");

    printf("\n===============================================\n");
}
