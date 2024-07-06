import { useEffect, useState } from 'react';

import { Todo, todoSchema } from '../types/todo';

export const useTodoList = () => {
  const [todoList, setTodoList] = useState<Todo[]>(() => {
    const localStorageTodoList = localStorage.getItem('todoList');
    return JSON.parse(localStorageTodoList ?? '[]');
  });

  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }, [todoList]);

  const changeCompleted = (id: number) => {
    setTodoList((prevTodoList) => {
      return prevTodoList.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      });
    });
  };

  const addTodo = (title: string) => {
    setTodoList((prevTodoList) => {
      const newTodo = {
        id: Date.now(),
        title,
        completed: false,
      };

      const validatedNewTodo = todoSchema.safeParse(newTodo);

      if (!validatedNewTodo.success) {
        validatedNewTodo.error.errors.forEach((error) => {
          switch (error.path[0]) {
            case 'id':
              alert('idは数値で入力してください');
              break;
            case 'title':
              alert('titleは文字列で入力してください');
              break;
            case 'completed':
              alert('completedは真偽値で入力してください');
              break;
          }
        });

        return prevTodoList;
      }

      return [newTodo, ...prevTodoList];
    });
  };

  const deleteTodo = (id: number) => {
    setTodoList((prevTodoList) => {
      return prevTodoList.filter((todo) => {
        return todo.id !== id;
      });
    });
  };

  const deleteAllCompleted = () => {
    setTodoList((prevTodoList) => {
      return prevTodoList.filter((todo) => {
        return !todo.completed;
      });
    });
  };

  return {
    todoList,
    changeCompleted,
    addTodo,
    deleteTodo,
    deleteAllCompleted,
  };
};
