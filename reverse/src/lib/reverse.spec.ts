import { reverse } from './reverse';
import fc from 'fast-check';


describe('reverse', () => {

  // example-based

  it('(naive) should reverse an array', () => {
    expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
  });
  it('(naive) should reverse another array.....', () => {
    expect(reverse([3, 2, 1])).toEqual([1, 2, 3]);
  });
  it('(honest) should reverse [3, 4, 5] to [5, 4, 3]', () => {
    expect(reverse([3, 4, 5])).toEqual([5, 4, 3]);
  });
  it('(honest) should reverse [5, 4, 3] to [3, 4, 5]', () => {
    expect(reverse([5, 4, 3])).toEqual([3, 4, 5]);
  });

  // property-based

  it('naive involution', () => {
    fc.assert(fc.property(fc.array(fc.integer()), xs => {
      expect(reverse(reverse(xs))).toEqual(xs);
    }));
  });

  it ('naive reversing', () => {
    fc.assert(fc.property(fc.array(fc.integer()), xs => {
      expect(reverse(xs)).toEqual(xs.slice().reverse());
    }));
  })

  type ToEq = any; // stub, ideally should be a trait of toEqual

  // reverse(reverse(a)) = a, for any a
  const involution = <T extends ToEq>(f: (x: T) => T) => (x: T) => expect(f(f(x))).toEqual(x);

  // reverse(a).length = a.length, for any a
  const lengthPreserving = <T extends ToEq>(f: (xs: readonly T[]) => T[]) => (xs: readonly T[]) => expect(f(xs).length).toEqual(xs.length);

  // reverse(reverse(a)) = a, for any a
  const reversing = <T extends ToEq>(f: (xs: readonly T[]) => T[]) => (xs: readonly T[]) => expect(f(xs)).toEqual(xs.slice().reverse());

  // reverse(reverse(a)) = a, for any a
  const reversingNaive = <T extends ToEq>(f: (xs: readonly T[]) => T[]) => (xs: readonly T[]) => {
    // console.log('xs', xs);
    for (let i = 0; i < xs.length; i++) {
      // just an example, don't try at home. error message won't be very helpful here
      expect(f(xs)[i]).toEqual(xs[xs.length - i - 1]);
    }
  };

  it('should be an involution', () => {
    fc.assert(fc.property(fc.array(fc.integer()), involution(reverse)));
  });
  it('should preserve length', () => {
    fc.assert(fc.property(fc.array(fc.integer()), lengthPreserving(reverse)));
  });
  it('should reverse', () => {
    fc.assert(fc.property(fc.array(fc.integer()), reversing(reverse)));
  });
  it('should reverse (naive)', () => {
    fc.assert(fc.property(fc.array(fc.integer()), reversingNaive(reverse)));
  });

  // fancier version

  const assertIntArrayProperty = (f: (xs: readonly number[]) => number[]) => (p: (f1: typeof f) => (xs: number[]) => void) =>
    fc.assert(fc.property(fc.array(fc.integer()), p(f)));

  const assertIntArrayPropertyReverse = assertIntArrayProperty(reverse);

  it('(fancy) should be an involution', () => {
    assertIntArrayPropertyReverse(involution);
  });
  it('(fancy) should preserve length', () => {
    assertIntArrayPropertyReverse(lengthPreserving);
  });
  it('(fancy) should reverse', () => {
    assertIntArrayPropertyReverse(reversing);
  });
  it('(fancy) should reverse (naive)', () => {
    assertIntArrayPropertyReverse(reversingNaive)
  });

});


