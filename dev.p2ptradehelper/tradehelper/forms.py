from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordResetForm, SetPasswordForm
from django.contrib.auth.models import User

from .models import Profile


class ProfileForm(UserCreationForm):
    email = forms.EmailField(required=True, label='Почта')

    def __init__(self, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)
        for _object in self.fields.values():
            _object.widget.attrs.update({'class': 'form-control shadow-none', 'placeholder': _object.label})

        self.fields['username'].widget.attrs.update(
            {'class': 'form-control shadow-none', 'placeholder': 'Логин', 'type': 'text'})

    # Переопределяем подкласс Meta, перезаписывая кортеж fields с добавлением поля email
    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2",)

    # Переопределяем метод save, определяя новому пользователю значение атрибута email
    def save(self, commit=True):
        user = super(ProfileForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'email')

    def __init__(self, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'id': 'input_username', 'class': 'form-control shadow-none', 'placeholder': 'Логин',
                                                     'value': '{{ user.get_username }}', 'type': 'text'})
        self.fields['email'].widget.attrs.update({'id': 'input_email','class': 'form-control shadow-none',
                                                  'placeholder': 'Электронная почта', 'value': '{{ user.email }}',
                                                  'type': 'text'})


class ProfileImageForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('profile_photo', )

    def __init__(self, *args, **kwargs):
        super(ProfileImageForm, self).__init__(*args, **kwargs)
        self.fields['profile_photo'].widget.attrs.update(
            {'id': 'upload_photo', 'style': 'opacity: 0.0; position: relative; width: 100%; height:100%; '})


class UserLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(
        attrs={'id': 'input_login', 'class': 'form-control shadow-none', 'placeholder': 'Логин', 'type': 'text'}))
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={'id': 'input_password','class': 'form-control shadow-none', 'placeholder': 'Пароль', 'type': 'password'}))


class PasswordResetUserForm(PasswordResetForm):
    def __init__(self, *args, **kwargs):
        super(PasswordResetUserForm, self).__init__(*args, **kwargs)
        self.fields['email'].widget.attrs.update(
            {'class': 'form-control shadow-none', 'placeholder': 'Почта', 'type': 'text'})


class SetPasswordUserForm(SetPasswordForm):
    def __init__(self, *args, **kwargs):
        super(SetPasswordUserForm, self).__init__(*args, **kwargs)
        self.fields['new_password1'].widget.attrs.update(
            {'class': 'form-control shadow-none', 'placeholder': 'Новый пароль', 'type': 'password'})
        self.fields['new_password2'].widget.attrs.update(
            {'class': 'form-control shadow-none', 'placeholder': 'Повторите пароль', 'type': 'password'})
