! A Fortran sample, kept idiomatic so it is worth opening in the editor.

module geometry
  implicit none
  private

  public :: rectangle, area, perimeter

  integer, parameter :: dp = selected_real_kind(15, 307)
  real(dp), parameter :: pi = 3.141592653589793_dp

  type :: rectangle
    real(dp) :: width = 0.0_dp
    real(dp) :: height = 0.0_dp
  contains
    procedure :: area => rectangle_area
  end type rectangle

  interface scale
    module procedure scale_real, scale_int
  end interface scale

contains

  pure function rectangle_area(self) result(a)
    class(rectangle), intent(in) :: self
    real(dp) :: a

    a = self%width * self%height
  end function rectangle_area

  elemental function perimeter(w, h) result(p)
    real(dp), intent(in) :: w, h
    real(dp) :: p

    p = 2.0_dp * (w + h)
  end function perimeter

  subroutine scale_real(values, factor)
    real(dp), intent(inout) :: values(:)
    real(dp), intent(in) :: factor
    integer :: i

    do i = 1, size(values)
      values(i) = values(i) * factor
    end do
  end subroutine scale_real

  subroutine scale_int(values, factor)
    integer, intent(inout) :: values(:)
    integer, intent(in) :: factor

    values = values * factor
  end subroutine scale_int

end module geometry

program main
  use geometry, only: rectangle, perimeter
  implicit none

  integer, parameter :: n = 4
  type(rectangle) :: floor
  real(kind(1.0d0)) :: totals(n)
  character(len=*), parameter :: banner = 'Fortran sample'
  logical :: verbose = .true.
  integer :: i

  floor = rectangle(width=4.5d0, height=2.0d0)

  totals = [ (real(i, kind(1.0d0)), i = 1, n) ]

  if (verbose .and. floor%area() > 1.0d0) then
    write (*, '(A, F8.3)') banner // ': area = ', floor%area()
  else if (verbose) then
    print *, 'small'
  else
    continue
  end if

  select case (n)
  case (1)
    print *, 'one'
  case (2:3)
    print *, 'a few'
  case default
    print *, 'many'
  end select

  !$omp parallel do private(i)
  do i = 1, n
    if (totals(i) < 0.0d0) cycle
    totals(i) = totals(i) + perimeter(1.0d0, 2.0d0)
  end do
  !$omp end parallel do

  associate (first => totals(1))
    print *, 'first is ', first
  end associate

  ! A continued statement, joined by an ampersand.
  print *, 'width ', floor%width, &
           ' height ', floor%height

100 format (A, 1X, I0)

end program main
