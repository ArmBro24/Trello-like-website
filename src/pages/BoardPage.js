import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoard } from '../context/BoardContext';
import { v4 as uuid } from 'uuid';
import Column from '../compomemts/Column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function BoardPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { boards, dispatch } = useBoard();
    const board = boards.find((b) => b.id === id);
    const [columnName, setColumnName] = useState('');

    if (!board) {
        return (
            <div>
                <p>Board not found.</p>
                <button onClick={() => navigate('/')}>Back to Boards</button>
            </div>
        );
    }

    const addColumn = () => {
        if (!columnName.trim()) return;
        const newColumn = {
            id: uuid(),
            name: columnName,
            tasks: [],
        };
        dispatch({ type: 'ADD_COLUMN', payload: newColumn });
        setColumnName('');
    };

    const handleDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination || source.droppableId === destination.droppableId) return;

        dispatch({
            type: 'MOVE_TASK',
            payload: {
                fromColId: source.droppableId,
                toColId: destination.droppableId,
                taskId: draggableId,
            },
        });
    };

    return (
        <div className="board-page">
            <h2>{board.name}</h2>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="columns-container" style={{ display: 'flex', gap: '16px' }}>
                    {board.columns.map((col) => (
                        <Droppable key={col.id} droppableId={col.id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        background: '#f4f4f4',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        minWidth: '250px',
                                    }}
                                >
                                    <Column column={col} />
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <div className="add-column" style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    placeholder="Column name"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                />
                <button onClick={addColumn}>Add Column</button>
            </div>

            <button onClick={() => navigate('/')}>← Back to Boards</button>
        </div>
    );
}

export default BoardPage;
