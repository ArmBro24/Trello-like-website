import React, { createContext, useContext, useReducer, useEffect } from 'react';

export const BoardContext = createContext();

const initialState = JSON.parse(localStorage.getItem('board-data')) || {
    boards: [],
    activeBoardId: null,
};

function boardReducer(state, action) {
    switch (action.type) {
        case 'CREATE_BOARD':
            return {
                ...state,
                boards: [...state.boards, action.payload],
            };

        case 'EDIT_BOARD':
            return {
                ...state,
                boards: state.boards.map((board) =>
                    board.id === action.payload.id
                        ? { ...board, ...action.payload.updates }
                        : board
                ),
            };


        case 'DELETE_BOARD':
            return {
                ...state,
                boards: state.boards.filter(board => board.id !== action.payload),
                activeBoardId: state.activeBoardId === action.payload ? null : state.activeBoardId,
            };

        case 'SET_ACTIVE_BOARD':
            return {
                ...state,
                activeBoardId: action.payload,
            };

        case 'ADD_COLUMN':
            return {
                ...state,
                boards: state.boards.map(board =>
                    board.id === state.activeBoardId
                        ? { ...board, columns: [...board.columns, action.payload] }
                        : board
                ),
            };

        case 'EDIT_COLUMN':
            return {
                ...state,
                boards: state.boards.map(board =>
                    board.id === state.activeBoardId
                        ? {
                            ...board,
                            columns: board.columns.map(col =>
                                col.id === action.payload.id
                                    ? { ...col, name: action.payload.name }
                                    : col
                            ),
                        }
                        : board
                ),
            };


        case 'DELETE_COLUMN':
            return {
                ...state,
                boards: state.boards.map(board =>
                    board.id === state.activeBoardId
                        ? {
                            ...board,
                            columns: board.columns.filter(col => col.id !== action.payload),
                        }
                        : board
                ),
            };

        case 'ADD_TASK':
            return {
                ...state,
                boards: state.boards.map(board =>
                    board.id === state.activeBoardId
                        ? {
                            ...board,
                            columns: board.columns.map(col =>
                                col.id === action.payload.columnId
                                    ? { ...col, tasks: [...col.tasks, action.payload.task] }
                                    : col
                            ),
                        }
                        : board
                ),
            };

        case 'EDIT_TASK':
            return {
                ...state,
                boards: state.boards.map(board =>
                    board.id === state.activeBoardId
                        ? {
                            ...board,
                            columns: board.columns.map(col => ({
                                ...col,
                                tasks: col.tasks.map(task =>
                                    task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
                                ),
                            })),
                        }
                        : board
                ),
            };

        case 'DELETE_TASK':
            return {
                ...state,
                boards: state.boards.map(board =>
                    board.id === state.activeBoardId
                        ? {
                            ...board,
                            columns: board.columns.map(col => ({
                                ...col,
                                tasks: col.tasks.filter(task => task.id !== action.payload),
                            })),
                        }
                        : board
                ),
            };

        case 'MOVE_TASK': {
            const { fromColId, toColId, taskId } = action.payload;
            const updatedBoards = state.boards.map(board => {
                if (board.id !== state.activeBoardId) return board;

                let taskToMove;
                const columns = board.columns.map(col => {
                    if (col.id === fromColId) {
                        taskToMove = col.tasks.find(task => task.id === taskId);
                        return { ...col, tasks: col.tasks.filter(task => task.id !== taskId) };
                    }
                    return col;
                }).map(col => {
                    if (col.id === toColId && taskToMove) {
                        return { ...col, tasks: [...col.tasks, taskToMove] };
                    }
                    return col;
                });

                return { ...board, columns };
            });

            return { ...state, boards: updatedBoards };
        }

        default:
            return state;
    }
}

export const BoardProvider = ({ children }) => {
    const [state, dispatch] = useReducer(boardReducer, initialState);

    useEffect(() => {
        localStorage.setItem('board-data', JSON.stringify(state));
    }, [state]);

    return (
        <BoardContext.Provider value={{ ...state, dispatch }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoard = () => useContext(BoardContext);
