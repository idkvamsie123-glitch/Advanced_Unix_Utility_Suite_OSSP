CC = gcc
CFLAGS = -Wall -Wextra -std=c11
LDFLAGS = -pthread

OBJS = main.o system_info.o process_manager.o file_system.o ipc.o memory.o concurrency.o

unixsuite: $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o unixsuite $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f $(OBJS) unixsuite
