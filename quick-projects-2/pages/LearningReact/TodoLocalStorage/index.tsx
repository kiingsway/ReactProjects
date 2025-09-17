import LearningNav from '@/components/LearningReact/LearningNav';
import { Button, Checkbox, DatePicker, Input, List, Tooltip } from 'antd';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { MdInfoOutline } from 'react-icons/md';
import useBoolean from '@/services/hooks/useBoolean';
import TaskModal from './TaskModal';

export interface ITask {
  id: string,
  title: string,
  completed: boolean,
  dueDate: string,
  description: string,
  created: string,
  modified: string,
}

export interface ITaskForm extends Omit<ITask, 'dueDate' | 'created' | 'modified'> {
  dueDate: Dayjs | null;
  created: Dayjs | null;
  modified: Dayjs | null;
}

const storageKey = 'todoLocalStorageTasks';

const blankTask: ITask = {
  id: '',
  title: '',
  completed: false,
  dueDate: '',
  description: '',
  created: '',
  modified: '',
};

export default function TodoLocalStorage(): React.JSX.Element {

  const [allTasks, setAllTasks] = React.useState<ITask[]>([]);
  const [newTask, setNewTask] = React.useState<ITask>(blankTask);
  const [selectedTask, selectTask] = React.useState<ITask>();
  const [formOpen, { setTrue: openForm, setFalse: closeForm }] = useBoolean();

  const setTaskTitle = (title: string): void => setNewTask(prev => ({ ...prev, title }));
  const setTaskDueDate = (date: Dayjs | null): void => setNewTask(prev => ({ ...prev, dueDate: date?.toISOString() || '' }));

  const createTask = (): void => {
    if (!newTask.title) return;

    const newItem: ITask = {
      ...newTask,
      id: createId(),
      created: dayjs().toISOString(),
      modified: dayjs().toISOString(),
    };

    setAllTasks(prev => [...prev, newItem]);
    setNewTask(blankTask);
  };

  const deleteTask = (id: string): void => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    setAllTasks(prev => prev.filter(task => task.id !== id));
  };

  const onSave = (id: string, updatedFields: Partial<ITask>): void => {

    const newTask = {
      ...updatedFields,
      modified: dayjs().toISOString(),
    };

    setAllTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task;
        const newt = { ...task, ...newTask };
        selectTask(newt);
        return newt;
      })
    );
  };

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setAllTasks(JSON.parse(stored));
  }, []);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(allTasks));
  }, [allTasks]);

  const onCompleted = (taskId: string, completed: boolean): void => {
    setAllTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, completed, modified: dayjs().toISOString() }
          : task
      )
    );
  };

  const onTaskClick = (task: ITask): void => {
    selectTask(task);
    openForm();
  };

  const onFormClose = (): void => {
    closeForm();
    selectTask(undefined);
  };

  return (
    <LearningNav name={TodoLocalStorage.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 20, marginTop: 10, backgroundColor: '#222', borderRadius: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            onPressEnter={createTask}
            placeholder='Add a task...'
            value={newTask.title}
            onChange={e => setTaskTitle(e.target.value)} />
          <DatePicker
            placeholder="Due date..."
            value={newTask.dueDate ? dayjs(newTask.dueDate) : null}
            onChange={setTaskDueDate}
          />
          <Button type='primary' disabled={!newTask} onClick={createTask}>Send</Button>
        </div>

        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={allTasks}
          renderItem={item => (
            <List.Item
              actions={[
                <TaskInfo key='info' task={item} />,
                <Button key='del' danger type='text' onClick={() => deleteTask(item.id)}>
                  Delete
                </Button>
              ]}
            >
              <TaskDetails task={item} onCompleted={onCompleted} onTaskClick={() => onTaskClick(item)} />
            </List.Item>
          )}
        />

      </div>
      <TaskModal
        open={formOpen}
        task={selectedTask}
        onSave={onSave}
        onClose={onFormClose}
      />
    </LearningNav>
  );
}

export function createId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

const TaskInfo = ({ task }: { task: ITask }): React.JSX.Element => {

  const formatDate = (d?: string): string => !d ? '' : dayjs(d).format('DD/MM/YYYY HH:mm:ss');

  const TooltipTitle = (): React.JSX.Element => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {task.created ? <span>Created: {formatDate(task.created)}</span> : <></>}
      {task.modified ? <span>Modified: {formatDate(task.modified)}</span> : <></>}
      {task.description ? <span>Description: {task.description}</span> : <></>}
    </div>
  );

  return (
    <Tooltip title={<TooltipTitle />}>
      <Button key='info' style={{ color: 'white' }} icon={<MdInfoOutline />} type='text' />
    </Tooltip>
  );
};

interface TaskDetailsProps {
  task: ITask;
  // eslint-disable-next-line no-unused-vars
  onCompleted: (taskId: string, completed: boolean) => void;
  onTaskClick: () => void;
}

const TaskDetails = ({ task, onCompleted, onTaskClick }: TaskDetailsProps): React.JSX.Element => {

  const TaskDueDate = (): React.JSX.Element => {
    if (!task.dueDate) return <></>;

    let color = 'white';
    if (!task.completed && task.dueDate) {
      const due = dayjs(task.dueDate).startOf('day');
      const today = dayjs().startOf('day');
      if (due.isBefore(today)) color = 'red';
      else if (due.isSame(today)) color = 'yellow';
    }

    return (
      <span style={{ color, opacity: 0.8 }}>
        {dayjs(task.dueDate).format('DD/MM/YYYY')}
      </span>
    );
  };

  const textDecoration = task.completed ? 'line-through' : 'none';

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <Checkbox checked={task.completed} onChange={e => onCompleted(task.id, e.target.checked)} />
      <Button onClick={onTaskClick} type='text' style={{
        color: 'white',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start'
      }}>
        <span style={{ color: 'white', fontWeight: 500, fontSize: 15, textDecoration }}>
          {task.title}
        </span>
        <TaskDueDate />
      </Button>
    </div>
  );
};