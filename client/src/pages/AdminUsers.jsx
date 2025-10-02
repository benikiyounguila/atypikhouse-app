
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios'; 

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [error, setError] = useState(null); 

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`admin/users`);
        console.log("Données reçues :", response.data);
        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          console.error("Format inattendu :", response.data);
          setUsers([]);
          setError('Format de données inattendu.');
        }
      } catch (error) {
        console.error("Erreur API :", error.response ? error.response.data : error.message);
        setError('Échec de la récupération des utilisateurs. Vérifiez le token ou le serveur.');
      }
    };

    fetchUsers();
  }, [API_BASE_URL]);

  const handleDelete = async (userId) => {
    const adminUser = users.find((user) => user._id === userId && user.isAdmin);

    if (adminUser) {
      alert("Vous ne pouvez pas supprimer l'utilisateur administrateur principal.");
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axiosInstance.delete(`users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Échec de la suppression de l\'utilisateur.');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm('Êtes-vous sûr de vouloir changer le rôle de cet utilisateur ?')) {
      try {
        const response = await axiosInstance.put(
          `admin/update-user-role/${userId}`,
          { role: newRole }
        );
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: response.data.data.role } : user
          )
        );
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Échec de la mise à jour du rôle.');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditedName(`${user.firstName} ${user.lastName}`);
    setEditedEmail(user.email);
  };

  const handleSave = async (userId) => {
    try {
      const nameParts = editedName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      await axiosInstance.put(
        `${API_BASE_URL}/admin/update-user/${userId}`,
        { firstName, lastName, email: editedEmail }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, firstName, lastName, email: editedEmail } : user
        )
      );
      setEditingUserId(null);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Échec de la mise à jour de l\'utilisateur.');
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`;
        return (
          fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (roleFilter ? user.role === roleFilter : true)
        );
      })
    : [];

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="modérateur">Modérateur</option>
          <option value="owner">Propriétaire</option>
          <option value="utilisateur">Utilisateur</option>
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Nom</th>
            <th className="px-4 py-2 text-center">Email</th>
            <th className="px-4 py-2 text-center">Rôle</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2 text-center">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="p-1 border rounded"
                    />
                  ) : (
                    `${user.firstName} ${user.lastName}`
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="p-1 border rounded"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-1 border rounded"
                    disabled={user.isAdmin} // Disable role change for admins
                  >
                    <option value="admin">Admin</option>
                    <option value="modérateur">Modérateur</option>
                    <option value="owner">Propriétaire</option>
                    <option value="utilisateur">Utilisateur</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  {editingUserId === user._id ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 mr-2"
                        onClick={() => handleSave(user._id)}
                      >
                        Enregistrer
                      </button>
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-700"
                        onClick={() => setEditingUserId(null)}
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2"
                        onClick={() => handleEdit(user)}
                      >
                        Modifier
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDelete(user._id)}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-2 text-center">
                {error || 'Aucun utilisateur trouvé.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;