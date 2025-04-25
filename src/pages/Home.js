import React, { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import EditModal from '../compomemts/EditModal'; // ✅ Keep this

function Home() {
    const { boards, dispatch } = useBoard();
    const [boardName, setBoardName] = useState('');
    const [editingBoard, setEditingBoard] = useState(null); // ✅ New

    const navigate = useNavigate();

    const handleCreate = () => {
        if (!boardName.trim()) return;
        const newBoard = {
            id: uuid(),
            name: boardName,
            columns: [],
        };
        dispatch({ type: 'CREATE_BOARD', payload: newBoard });
        setBoardName('');
    };

    const handleSelect = (id) => {
        dispatch({ type: 'SET_ACTIVE_BOARD', payload: id });
        navigate(`/board/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this board?')) {
            dispatch({ type: 'DELETE_BOARD', payload: id });
        }
    };

    return (
        <div className="home">
            <h2>My Boards</h2>

            {boards.map((board) => (
                <div key={board.id} className="board-card">
                    <h3 onClick={() => handleSelect(board.id)}>{board.name}</h3>
                    <button onClick={() => handleDelete(board.id)}>Delete</button>
                    <button onClick={() => setEditingBoard(board)}>Edit</button> {/* ✅ New */}
                </div>
            ))}

            <div className="add-board">
                <input
                    type="text"
                    placeholder="Board name"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                />
                <button onClick={handleCreate}>Create Board</button>
            </div>


            {/* ✅ Reusing task modal to edit board name */}
            <EditModal
                isOpen={!!editingBoard}
                task={editingBoard}
                onClose={() => setEditingBoard(null)}
                onSave={(updated) => {
                    dispatch({
                        type: 'EDIT_BOARD',
                        payload: {
                            id: updated.id,
                            updates: {
                                name: updated.name || updated.title, // ☑️ SUPPORT BOTH
                            },
                        },
                    });
                    setEditingBoard(null);
                }}
            />
        </div>
    );
}

export default Home;
