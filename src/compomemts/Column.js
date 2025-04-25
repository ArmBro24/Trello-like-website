import React, { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { v4 as uuid } from 'uuid';
import TaskCard from './TaskCard';
import EditModal from './EditModal';

function Column({ column }) {
    const { dispatch } = useBoard();
    const [taskText, setTaskText] = useState('');
    const [tag, setTag] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleAddTask = () => {
        if (!taskText.trim()) return;

        const newTask = {
            id: uuid(),
            title: taskText,
            description: '',
            completed: false,
            tags: tag ? [tag.trim()] : [],
        };

        dispatch({
            type: 'ADD_TASK',
            payload: {
                columnId: column.id,
                task: newTask,
            },
        });

        setTaskText('');
        setTag('');
    };

    const handleDeleteColumn = () => {
        if (window.confirm('Delete this column and all its tasks?')) {
            dispatch({ type: 'DELETE_COLUMN', payload: column.id });
        }
    };

    return (
        <div className="column" style={{ background: '#f4f4f4', padding: '10px', borderRadius: '6px', minWidth: '250px' }}>
            <h3>{column.name}</h3>

            <button onClick={() => setIsEditing(true)}>Edit Column</button>

            {column.tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} columnId={column.id} index={index} />
            ))}

            <input
                type="text"
                placeholder="Task name"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
            />
            <input
                type="text"
                placeholder="Tag (optional)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>
            <button onClick={handleDeleteColumn}>Delete Column</button>

            <EditModal
                isOpen={isEditing}
                task={column}
                onClose={() => setIsEditing(false)}
                onSave={(updatedCol) => {
                    dispatch({
                        type: 'EDIT_COLUMN',
                        payload: {
                            id: updatedCol.id,
                            name: updatedCol.name,
                        },
                    });
                    setIsEditing(false);
                }}
            />
        </div>
    );
}

export default Column;
