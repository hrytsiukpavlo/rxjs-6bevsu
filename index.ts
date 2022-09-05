import './style.css';

import {
  Observable,
  catchError,
  of,
  fromEvent,
  interval,
  takeWhile,
  refCount,
  publish,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

const someDivInDocument = document.querySelector('.someDiv') as HTMLDivElement;

// #1
// Створити Observable, яка буде віддавати 2 синхронні значення "1", "2", а через 2 секунди викидувати помилку. Ваша задача використовуючи існуючі оператори обробити цю помилку всередині pipe, для того, щоб вона не дійшла до subscribe

// const observable = new Observable((subscriber) => {
//   subscriber.next(1);
//   subscriber.next(2);
//   setTimeout(() => {
//     subscriber.error('Test error');
//   }, 2000);
// });

// observable.pipe(catchError((err) => of(err))).subscribe({
//   next: (x) => console.log('Value: ' + x),
//   error: (err) => console.error('Error caught: ' + err),
//   complete: () => console.log('Completed'),
// });

// #2
// Створити аналог fromEvent оператора( який під капотом використовує addEventListener).
// Не забувайте про витоки пам'яті і те, як їх уникати в RxJS(після відписання від цього оператора ми не повинні більше слухати події)

// function addEvent(handle: any) {
//   someDivInDocument.addEventListener('click', handle);
// }

// function removeEvent(handle: any) {
//   someDivInDocument.removeEventListener('click', handle);
// }

// const customFromEvent = function (add: Function, remove: Function) {
//   return new Observable((operator) => {
//     add((event: Event) => operator.next(event));
//     remove((event: Event) => operator.next(event));
//   });
// };

// customFromEvent(addEvent, removeEvent).subscribe(() => console.log('Click'));

// const customFromEvent = (element, ev) => {
//   return element.addEventListener(ev, () => {
//     console.log('click');
//   });
// };

// const test = customFromEvent(someDivInDocument, 'click');

// #3
// Використовуючи оператор interval, підписатися на нього і слухати до того моменту, доки значення не буде більше 5(використовуючи оператор в pipe)

// interval(1000)
//   .pipe(takeWhile((x) => x < 6))
//   .subscribe((x) => console.log(x));

// #4
// Перетворіть coldInterval нижче на hotInterval, щоб він став гарячим(віддавав одні і ті ж значення різним підписникам)
// function coldInterval() {
//   return new Observable((subscriber) => {
//     let count = 0;
//     const intervalId = setInterval(() => {
//       if (count < 5) {
//         subscriber.next(count++);
//       } else {
//         subscriber.complete();
//       }
//     }, 2000);

//     return () => {
//       clearInterval(intervalId);
//     };
//   });
// }

// coldInterval().subscribe((value) => console.log('sub1:', value));
// setTimeout(
//   () => coldInterval().subscribe((value) => console.log('sub2:', value)),
//   3000
// );

const refCountInterval = interval(1000).pipe(
  takeWhile((x) => x < 6),
  publish(),
  refCount()
);

refCountInterval.subscribe((value) => console.log('sub1: ', value));
setTimeout(() => {
  refCountInterval.subscribe((value) => console.log('sub2: ', value));
}, 3000);

// #5

// Обробити відповідь запиту, в pipe спочатку витягнути об'єкт response(це масив), відфільтруєте масив так, щоб залишилися тільки пости з id менше 5.
// Hint: так як response - це буде масив постів, ви не можете просто фідфільтрувати його через filter(він приймає кожен елемент масиву, а не цілий масив). Для рішення цієї задачі вам потрібні оператори mergeMap або concatMap, в яких ви зробите з(перекладіть англійською) масиву потік окремих елементів масиву([1, 2, 3] => 1, 2, 3), відфільтруєте їх,а потім зберете назад в масив за допомогою оператора. В subscribe ми отримаємо масив з 4 об'єктів id яких менше 5

// .ajax('https://jsonplaceholder.typicode.com/posts');

// Використовуючи Rxjs написати потік, який буде слухати кліки по кнопці і відправляти при натисканню на неї запит на сервер із текстом введеним в пошук. В subscribe ми маємо отримати дані з серверу.
// Оператори, які можуть знадобитися: fromEvent, switchMap, ajax, map, etc

// const search = document.querySelector('input');
// const button = document.querySelector('button');

// Використовуючи RxJs зробити свою імплементацію Drag&Drop.
// Деталі: Створіть 3 observable mousedown$, mousemove$, mouseup$. Які будуть слухати події mousedown, mousemove, mouseup відповідно. Ваша задача поєднати їх так, щоб mousemove$ починав працювати тільки коли користувач натикає  на mousedown, і переставали слухати, коли відбувається mouseup. Тобто постійно ви маєте слухати тільки mousedown, а підписуватися на зміну mousemove i mouseup тільки після івенту mousedown
// const mousedown$ = ... .pipe().subscribe(value - колекція mousemove подій, яка починається віддаватися при mousedown і закінчує стрім при mouseup)
