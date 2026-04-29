import pytest
from django.contrib.auth.models import User
from django.test import Client


@pytest.mark.django_db
def test_main_page_anonymous_renders():
    """Anonymous GET / should render (no 5xx)."""
    client = Client()
    resp = client.get("/")
    assert resp.status_code in (200, 302)


@pytest.mark.django_db
def test_admin_login_renders():
    client = Client()
    resp = client.get("/admin/login/")
    assert resp.status_code == 200


@pytest.mark.django_db
def test_create_event_requires_login():
    client = Client()
    resp = client.get("/event/new")
    assert resp.status_code in (302, 403)


@pytest.mark.django_db
def test_authenticated_user_can_create_event():
    user = User.objects.create_user(
        username="alice", email="alice@example.com", password="pw"
    )
    client = Client()
    client.force_login(user)
    resp = client.get("/event/new")
    assert resp.status_code == 200


@pytest.mark.django_db
def test_user_autocomplete_returns_matches():
    user = User.objects.create_user(
        username="alice", email="alice@example.com", password="x"
    )
    User.objects.create_user(
        username="bob", email="bob@example.com", password="x"
    )
    client = Client()
    client.force_login(user)
    resp = client.get("/u/user-autocomplete/?q=alic")
    assert resp.status_code == 200
    data = resp.json()
    usernames = [r["text"] for r in data["results"]]
    assert any("alice" in name for name in usernames)
    assert not any("bob" in name for name in usernames)


@pytest.mark.django_db
def test_user_autocomplete_anonymous_redirects():
    client = Client()
    resp = client.get("/u/user-autocomplete/")
    assert resp.status_code in (302, 403)
