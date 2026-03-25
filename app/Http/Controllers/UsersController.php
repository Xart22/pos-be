<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index()
    {
        $this->ensureAdmin();

        $users = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'nip', 'role', 'base_gaji', 'created_at', 'updated_at']);

        return Inertia::render('users/page', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nip' => ['required', 'numeric', 'digits_between:1,20', 'unique:users,nip'],
            'role' => ['required', Rule::in(['admin', 'kasir', 'waiters', 'helper', 'barista'])],
            'base_gaji' => ['required', 'numeric', 'min:0'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'nip' => $validated['nip'],
            'role' => $validated['role'],
            'base_gaji' => $validated['base_gaji'],
            'password' => $validated['password'],
        ]);

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, int $id)
    {
        $this->ensureAdmin();

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nip' => ['required', 'numeric', 'digits_between:1,20', Rule::unique('users', 'nip')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'kasir', 'owner'])],
            'base_gaji' => ['required', 'numeric', 'min:0'],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $payload = [
            'name' => $validated['name'],
            'nip' => $validated['nip'],
            'role' => $validated['role'],
            'base_gaji' => $validated['base_gaji'],
        ];

        if (!empty($validated['password'])) {
            $payload['password'] = $validated['password'];
        }

        $user->update($payload);

        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $this->ensureAdmin();

        $user = User::findOrFail($id);
        if ((int) Auth::id() === (int) $user->id) {
            return redirect()->route('users.index')->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }

    private function ensureAdmin(): void
    {
        abort_if(Auth::user()?->role !== 'admin', 403, 'Anda tidak memiliki akses.');
    }
}
