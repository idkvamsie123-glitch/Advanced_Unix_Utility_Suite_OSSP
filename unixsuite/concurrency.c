
#define _POSIX_C_SOURCE 200809L
#include <stdio.h>
#include <pthread.h>

#include "concurrency.h"

#define ITERATIONS 100000

static long shared_counter = 0;
static pthread_mutex_t counter_mutex = PTHREAD_MUTEX_INITIALIZER;

static void *worker(void *arg)
{
    long id = *(long *)arg;

    for (int i = 0; i < ITERATIONS; i++)
    {
        pthread_mutex_lock(&counter_mutex);
        shared_counter++;
        pthread_mutex_unlock(&counter_mutex);
    }

    printf("[Thread %ld] Completed %d increments.\n", id, ITERATIONS);
    return NULL;
}

void thread_demo(void)
{
    pthread_t thread1, thread2;
    long id1 = 1;
    long id2 = 2;

    shared_counter = 0;

    printf("\n===============================================\n");
    printf("          CONCURRENCY & SYNCHRONIZATION       \n");
    printf("===============================================\n");

    printf("\n[INTERNAL WORKING]\n");
    printf("pthread_create() creates threads inside one process.\n");
    printf("Both threads access the same shared counter.\n");
    printf("A mutex protects the counter from simultaneous updates.\n");

    printf("\n[1] Creating threads\n");
    printf("-----------------------------------------------\n");

    if (pthread_create(&thread1, NULL, worker, &id1) != 0)
    {
        printf("[ERROR] pthread_create() failed for thread 1.\n");
        return;
    }

    if (pthread_create(&thread2, NULL, worker, &id2) != 0)
    {
        printf("[ERROR] pthread_create() failed for thread 2.\n");
        pthread_join(thread1, NULL);
        return;
    }

    printf("Thread 1 created successfully.\n");
    printf("Thread 2 created successfully.\n");

    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);

    printf("\n[2] Thread synchronization\n");
    printf("-----------------------------------------------\n");
    printf("Mutex: pthread_mutex_lock() / unlock()\n");
    printf("Each thread increments the shared counter safely.\n");

    printf("\n[RESULT]\n");
    printf("-----------------------------------------------\n");
    printf("Expected Counter : %d\n", ITERATIONS * 2);
    printf("Actual Counter   : %ld\n", shared_counter);

    printf("\n[INTERNAL]\n");
    printf("pthread_join() waits for both threads to finish.\n");
    printf("The mutex prevents concurrent updates from corrupting the counter.\n");

    printf("\nTHREAD FLOW\n");
    printf("-----------------------------------------------\n");
    printf("              Main Process\n");
    printf("                    |\n");
    printf("          pthread_create()\n");
    printf("             /          \\\n");
    printf("            v            v\n");
    printf("        Thread 1      Thread 2\n");
    printf("            \\            /\n");
    printf("             \\  Mutex   /\n");
    printf("              \\   |    /\n");
    printf("               \\  |   /\n");
    printf("                Shared Counter\n");
    printf("                    |\n");
    printf("              pthread_join()\n");

    printf("\n===============================================\n");
}
