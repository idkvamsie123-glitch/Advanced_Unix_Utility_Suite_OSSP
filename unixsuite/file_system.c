#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <errno.h>

#include "file_system.h"

void file_info(const char *filename)
{
    struct stat st;

    printf("\n===============================================\n");
    printf("                FILE INFORMATION              \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("stat() asks Linux for metadata about the file.\n");

    if (stat(filename, &st) == -1)
    {
        perror("[ERROR] stat()");
        return;
    }

    printf("\nFile: %s\n", filename);

    printf("\nFILE ATTRIBUTES\n");
    printf("-----------------------------------------------\n");
    printf("Size       : %ld bytes\n", (long)st.st_size);
    printf("Permissions: %o\n", st.st_mode & 0777);
    printf("Owner UID  : %d\n", st.st_uid);
    printf("Group GID  : %d\n", st.st_gid);
    printf("Links      : %ld\n", (long)st.st_nlink);

    printf("\n[INTERNAL]\n");
    printf("stat() obtains file metadata from the Linux\n");
    printf("file system.\n");

    printf("\n===============================================\n");
}

void read_file(const char *filename)
{
    int fd;
    char buffer[512];
    ssize_t bytes_read;

    printf("\n===============================================\n");
    printf("                  READ FILE                    \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("1. open() requests access to the file.\n");
    printf("2. Linux returns a file descriptor.\n");
    printf("3. read() obtains bytes from the file.\n");
    printf("4. close() releases the file descriptor.\n");

    fd = open(filename, O_RDONLY);

    if (fd == -1)
    {
        perror("[ERROR] open()");
        return;
    }

    printf("\n[INTERNAL]\n");
    printf("File opened successfully.\n");
    printf("File Descriptor (fd): %d\n", fd);

    printf("\nFILE CONTENT\n");
    printf("-----------------------------------------------\n");

    while ((bytes_read = read(fd, buffer, sizeof(buffer) - 1)) > 0)
    {
        buffer[bytes_read] = '\0';
        printf("%s", buffer);
    }

    if (bytes_read == -1)
        perror("[ERROR] read()");

    close(fd);

    printf("\n\n[INTERNAL]\n");
    printf("close(%d) released the file descriptor.\n", fd);

    printf("\n===============================================\n");
}

void create_file(const char *filename)
{
    int fd;

    printf("\n===============================================\n");
    printf("                  CREATE FILE                 \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("open() requests Linux to create a new file.\n");
    printf("O_CREAT creates the file if it does not exist.\n");

    fd = open(filename, O_WRONLY | O_CREAT | O_EXCL, 0777);

    if (fd == -1)
    {
        if (errno == EEXIST)
            printf("\n[ERROR] File already exists: %s\n", filename);
        else
            perror("[ERROR] open()");
        return;
    }

    printf("\n[SUCCESS]\n");
    printf("File created: %s\n", filename);
    printf("File Descriptor: %d\n", fd);

    printf("\n[INTERNAL]\n");
    printf("open() returned file descriptor %d.\n", fd);
    printf("The file descriptor represents the open file\n");
    printf("inside the process.\n");

    close(fd);

    printf("close() released the file descriptor.\n");

    printf("\n===============================================\n");
}
