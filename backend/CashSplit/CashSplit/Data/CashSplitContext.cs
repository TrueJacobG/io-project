using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CashSplit.Models;

namespace CashSplit.Data
{
    public class CashSplitContext : DbContext
    {
        public CashSplitContext (DbContextOptions<CashSplitContext> options)
            : base(options)
        {
        }

        public DbSet<CashSplit.Models.test> test { get; set; } = default!;
    }
}
