import { Pipe, PipeTransform } from '@angular/core';

const fibonnaci = (n: number): number => {
  if (n == 1 || n == 0) {
    return 1;
  }
  return fibonnaci(n - 1) + fibonnaci(n - 2);
};

@Pipe({
  name: 'fibo'
})
export class FiboPipe implements PipeTransform {
  transform(n: number): number {
    const fib = fibonnaci(n);
    console.log({n, fib});
    return fib;
  }
}
