'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers, User, UserFormData } from '@/hooks/useUsers';
import UserList from '@/components/users/UserList';
import UserForm from '@/components/users/UserForm';
import { toast } from 'sonner';

export default function UsersPage() {
  const router = useRouter();
  const { getUsers, createUser, updateUser, deleteUser, loading, error } = useUsers();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error('خطا در دریافت لیست کاربران');
    }
  };

  const handleCreateUser = async (data: UserFormData) => {
    try {
      await createUser(data);
      toast.success('کاربر با موفقیت ایجاد شد');
      setIsFormOpen(false);
      loadUsers();
    } catch (err) {
      toast.error('خطا در ایجاد کاربر');
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser.id, data);
      toast.success('کاربر با موفقیت ویرایش شد');
      setSelectedUser(null);
      setIsFormOpen(false);
      loadUsers();
    } catch (err) {
      toast.error('خطا در ویرایش کاربر');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;
    try {
      await deleteUser(id);
      toast.success('کاربر با موفقیت حذف شد');
      loadUsers();
    } catch (err) {
      toast.error('خطا در حذف کاربر');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">مدیریت کاربران</h1>
          <p className="mt-2 text-sm text-gray-600">
            افزودن، ویرایش و مدیریت کاربران سایت
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {isFormOpen ? (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
            </h2>
            <UserForm
              initialData={selectedUser || undefined}
              onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
              isSubmitting={loading}
            />
            <button
              onClick={() => {
                setIsFormOpen(false);
                setSelectedUser(null);
              }}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              انصراف
            </button>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">لیست کاربران</h2>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                افزودن کاربر جدید
              </button>
            </div>
            <UserList
              users={users}
              onEdit={handleEdit}
              onDelete={handleDeleteUser}
            />
          </div>
        )}
      </div>
    </div>
  );
} 