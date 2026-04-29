import pytest

from moderator.moderate.forms import QuestionForm


@pytest.mark.django_db
def test_question_form_rejects_too_short_text():
    form = QuestionForm(data={"question": "tiny"})
    assert not form.is_valid()
    assert "question" in form.errors


@pytest.mark.django_db
def test_question_form_rejects_too_long_text():
    form = QuestionForm(data={"question": "x" * 501})
    assert not form.is_valid()
    assert "question" in form.errors


@pytest.mark.django_db
def test_question_form_accepts_valid_text():
    form = QuestionForm(data={"question": "This is a perfectly valid question."})
    assert form.is_valid(), form.errors
