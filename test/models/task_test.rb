require 'test_helper'

class TaskTest < ActiveSupport::TestCase
  test 'create' do
    task = create(:task)
    assert task.persisted?
  end

  test 'states' do
    task = create(:task)

    assert_equal(task.state, 'new_task')
    assert_equal(task.state_events, [:archive, :to_development])

    assert task.to_development
    assert_equal(task.state, 'in_development')
    assert_equal(task.state_events, [:to_qa])

    assert task.to_qa
    assert_equal(task.state, 'in_qa')
    assert_equal(task.state_events, [:to_development, :to_code_review])

    assert task.to_code_review
    assert_equal(task.state, 'in_code_review')
    assert_equal(task.state_events, [:to_development, :to_ready_for_release])

    assert task.to_ready_for_release
    assert_equal(task.state, 'ready_for_release')
    assert_equal(task.state_events, [:release])

    assert task.release
    assert_equal(task.state, 'released')
    assert_equal(task.state_events, [:archive])

    assert task.archive
    assert_equal(task.state, 'archived')
    assert_equal(task.state_events, [])
  end
end
