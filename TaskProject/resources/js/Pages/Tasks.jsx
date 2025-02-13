import { useState } from "react";
import TaskItem from "@/ApplicationComponents/TaskItem";
import TaskForm from "@/ApplicationComponents/TaskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Inertia } from "@inertiajs/inertia";

export default function Tasks({ tasks = [], categories = [] }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // ✅ Görevleri tamamlanma durumuna göre ayır
    const [pendingTasks, setPendingTasks] = useState(tasks.filter((task) => !task.is_completed));
    const [completedTasks, setCompletedTasks] = useState(tasks.filter((task) => task.is_completed));

    // 🏗️ Drag & Drop işlemi gerçekleştiğinde çalışacak fonksiyon
    const onDragEnd = (result) => {
        if (!result.destination) return; // Eğer hedef alan yoksa işlem yapma

        const { source, destination } = result;

        // 📌 Kaynaktan hedefe görevi taşı
        let movedTask;
        if (source.droppableId === "pendingTasks") {
            movedTask = pendingTasks[source.index];
            setPendingTasks(pendingTasks.filter((_, i) => i !== source.index));
            setCompletedTasks([...completedTasks, { ...movedTask, is_completed: true }]);
        } else {
            movedTask = completedTasks[source.index];
            setCompletedTasks(completedTasks.filter((_, i) => i !== source.index));
            setPendingTasks([...pendingTasks, { ...movedTask, is_completed: false }]);
        }

        // 📌 Backend’e `PUT` isteği atarak görevin tamamlanma durumunu güncelle
        Inertia.put(`/tasks/${movedTask.id}/toggle-complete`, {
            is_completed: destination.droppableId === "completedTasks",
        });
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 📝 Yapılacak Görevler */}
                    <Droppable droppableId="pendingTasks">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Pending Tasks</h3>
                                {pendingTasks.length > 0 ? (
                                    <div className="space-y-4">
                                        {pendingTasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TaskItem
                                                            task={task}
                                                            categoryName={categories.find((c) => c.id === task.category_id)?.name || "Uncategorized"}
                                                            onEdit={(task) => {
                                                                setSelectedTask(task);
                                                                setModalOpen(true);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No pending tasks.</p>
                                )}
                            </div>
                        )}
                    </Droppable>

                    {/* ✅ Tamamlanmış Görevler */}
                    <Droppable droppableId="completedTasks">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Completed Tasks</h3>
                                {completedTasks.length > 0 ? (
                                    <div className="space-y-4">
                                        {completedTasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TaskItem
                                                            task={task}
                                                            categoryName={categories.find((c) => c.id === task.category_id)?.name || "Uncategorized"}
                                                            onEdit={(task) => {
                                                                setSelectedTask(task);
                                                                setModalOpen(true);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No completed tasks.</p>
                                )}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>

            {/* 📌 Edit Modal */}
            {modalOpen && (
                <TaskForm
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    task={selectedTask}
                />
            )}
        </>
    );
}
