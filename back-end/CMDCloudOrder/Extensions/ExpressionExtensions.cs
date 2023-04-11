using System.Linq.Expressions;

namespace CMDCloudOrder.Extensions;

public static class ExpressionExtensions
{
    public static Expression<Func<TSource, bool>> Or<TSource>(this IEnumerable<Expression<Func<TSource, bool>>> expressions)
    {
        // Get the enumerator
        using var enumerator = expressions.GetEnumerator();

        // Ensure there is at least one expression in the collection
        if (!enumerator.MoveNext())
        {
            throw new ArgumentException("The collection of expressions must have at least one element.", nameof(expressions));
        }

        // Start with the first expression
        var parameter = Expression.Parameter(typeof(TSource), "x");
        Expression combined = Expression.Invoke(enumerator.Current, parameter);

        // Combine the remaining expressions using the OR operator
        while (enumerator.MoveNext())
        {
            combined = Expression.OrElse(combined, Expression.Invoke(enumerator.Current, parameter));
        }

        // Create and return a new lambda expression with the combined body
        return Expression.Lambda<Func<TSource, bool>>(combined, parameter);
    }
}