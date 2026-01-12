/*Experiment 1:
Do the following:
        1.        Write the recurrence relation for the above function.
        2.        Using the Master Theorem, find the asymptotic time complexity and clearly state which case of the theorem is applied.
        3.        Modify the given code to:
        •        count the number of operations performed, and depth of the recursion tree
        •        measure the execution time (in milliseconds)
Print the number of operations and time taken for different input sizes
*/
import java.util.*;
public class ComplexRecursion {

    static long count = 0;
    static int maxDepth = 0;

    static void complexRec(int n, int depth) {
        maxDepth = Math.max(maxDepth, depth);

        if (n <= 2)
            return;

        int p = n;
        while (p > 0) {
            int[] temp = new int[n];
            for (int i = 0; i < n; i++) {
                temp[i] = i ^ p;
                count++;
            }
            p >>= 1;
            count++;
        }

        int[] small = new int[n];
        for (int i = 0; i < n; i++) {
            small[i] = i * i;
            count++;
        }

        for (int i = 0; i < n / 2; i++) {
            int t = small[i];
            small[i] = small[n - i - 1];
            small[n - i - 1] = t;
            count++;
        }

        complexRec(n / 2, depth + 1);
        complexRec(n / 2, depth + 1);
        complexRec(n / 2, depth + 1);
    }

    public static void main(String[] args) {

        int[] inputs = {200};

        for (int n : inputs) {
            count = 0;
            maxDepth = 0;

            long start = System.currentTimeMillis();
            complexRec(n, 1);
            long end = System.currentTimeMillis();

            System.out.println("Input size: " + n);
            System.out.println("Operations: " + count);
            System.out.println("Max Recursion Depth: " + maxDepth);
            System.out.println("Time (ms): " + (end - start));

        }
    }
}
/*Recurrence relation is T(n)=3T(n/2) + (nlogn)*/
/*Complexity = O(n^1.585)*/
